import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Running on Railway:', process.env.RAILWAY_STATIC_URL ? 'Yes' : 'No');

// Initialize connection variables
let pool = null;
let isConnected = false;
let connectionError = null;

// Determine if we should use mock data
const useMockData = process.env.USE_MOCK_DATA === 'true';
if (useMockData) {
  console.log('Mock data mode is enabled. Database connection will not be attempted.');
  connectionError = new Error('Mock data mode is enabled');
} else {
  // Check for Railway MySQL environment variables
  const hasRailwayMysql = !!(process.env.MYSQLHOST && process.env.MYSQLUSER);
  
  try {
    // Configure database connection
    const dbConfig = {
      // Priority: Railway MySQL vars > Custom env vars > Defaults
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
      ssl: { rejectUnauthorized: false },
      connectTimeout: 60000, // 60 seconds
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    
    // Log connection details (without password)
    console.log('Database configuration:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      ssl: 'Enabled',
      passwordProvided: dbConfig.password ? 'Yes' : 'No',
      usingRailwayVars: hasRailwayMysql ? 'Yes' : 'No'
    });
    
    // Create connection pool
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    connection.release();
    
    isConnected = true;
    console.log('Database connection successful!');
  } catch (error) {
    connectionError = error;
    console.error('Database connection failed:', error.message);
    console.log('The application will use mock data as a fallback.');
  }
}

export { pool, isConnected, connectionError };
