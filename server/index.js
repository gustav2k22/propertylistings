import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import propertyRoutes from './routes/properties.js';

// Check if we're running on Railway
const isRailway = process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_SERVICE_NAME;

// Import the database configuration based on environment
// For Railway, we'll use force-mock-data to ensure the app works without a database
// For local development, we'll use the regular database configuration
import * as fallbackController from './controllers/fallbackController.js';

// Import database configuration directly
// We'll use the fallback controller when the database connection fails
import { pool, isConnected, connectionError, useMockData } from './config/database.js';

// Force mock data mode in Railway environment if database connection fails
if (isRailway && !isConnected) {
  console.log('Running on Railway, using mock data mode');
  process.env.USE_MOCK_DATA = 'true';
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return res.status(200).json({});
  }
  next();
});

// Basic middleware
app.use(cors());

// Increase JSON payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Express JSON middleware with increased size limit is already configured above

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databaseConnected: isConnected,
    useMockData: useMockData || process.env.USE_MOCK_DATA === 'true'
  });
});

// Database diagnostic endpoint
app.get('/db-status', async (req, res) => {
  try {
    if (!isConnected || useMockData) {
      return res.status(200).json({
        status: 'mock',
        timestamp: new Date().toISOString(),
        message: 'Using mock data mode - database connection not available',
        error: connectionError ? connectionError.message : 'No connection established',
        environment: process.env.NODE_ENV || 'development',
        railwayDetected: isRailway
      });
    }
    
    // Try to connect to the database
    const connection = await pool.getConnection();
    
    // Get database info
    const [rows] = await connection.query('SELECT VERSION() as version');
    
    // Release the connection
    connection.release();
    
    // Return success
    res.status(200).json({
      status: 'connected',
      timestamp: new Date().toISOString(),
      database: {
        version: rows[0].version,
        config: {
          host: process.env.MYSQL_URL ? 'From MYSQL_URL' : process.env.DB_HOST || 'localhost',
          database: process.env.MYSQL_URL ? 'From MYSQL_URL' : process.env.DB_NAME || 'property_listings',
          user: 'HIDDEN',
          ssl: process.env.NODE_ENV === 'production' ? 'Enabled' : 'Disabled'
        }
      }
    });
  } catch (error) {
    // Return error
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      config: {
        mysqlUrl: process.env.MYSQL_URL ? 'Set' : 'Not set',
        mysqlHost: process.env.MYSQLHOST ? 'Set' : 'Not set',
        dbHost: process.env.DB_HOST || 'Not set',
        dbName: process.env.DB_NAME || 'Not set',
        nodeEnv: process.env.NODE_ENV || 'Not set'
      }
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('Property Listings Server');
});

// API Routes
app.use('/api/properties', propertyRoutes);

// Fallback API Routes (for when the database is unavailable)
const fallbackRouter = express.Router();
fallbackRouter.get('/', fallbackController.getAllProperties);
fallbackRouter.get('/:id', fallbackController.getPropertyById);
fallbackRouter.post('/', fallbackController.createProperty);
fallbackRouter.delete('/:id', fallbackController.deleteProperty);

// Mount the fallback API routes
app.use('/properties', fallbackRouter);
app.use('/v1/properties', fallbackRouter);

// Serve static files
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database Connected: ${isConnected ? 'Yes' : 'No (using mock data)'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
});

export default app; 