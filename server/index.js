import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import propertyRoutes from './routes/properties.js';
import * as fallbackController from './controllers/fallbackController.js';

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
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database diagnostic endpoint
app.get('/db-status', async (req, res) => {
  try {
    // Import the database pool
    const { pool } = await import('./config/database.js');
    
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