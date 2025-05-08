import mysql from 'mysql2/promise';
import { railwayDbConfig } from './railway-db-config.js';
import dotenv from 'dotenv';

dotenv.config();

// Log database connection attempt
console.log('Initializing database connection...');

// Track connection status
let isConnected = false;
let connectionError = null;

// Parse database configuration
let dbConfig;

try {
  // Check if we're running on Railway (environment variable specific to Railway)
  if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_SERVICE_NAME || process.env.MYSQLHOST) {
    console.log('Detected Railway environment, using Railway database configuration');
    
    // Use Railway's specific environment variables
    // These are automatically set by Railway when you add a MySQL database
    dbConfig = {
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      ssl: { rejectUnauthorized: false },
      connectTimeout: 60000, // Increase timeout for Railway connections
    };
    
    console.log('Using Railway MySQL environment variables');
  }
  // If MYSQL_URL is provided, try to use it
  else if (process.env.MYSQL_URL) {
    console.log('Using MYSQL_URL for database connection');
    // Parse the Railway URL
    try {
      const url = new URL(process.env.MYSQL_URL);
      
      // Railway MySQL URLs are in the format: mysql://username:password@hostname:port/database
      dbConfig = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', ''),
        port: url.port,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 60000, // Increase timeout for Railway connections
      };
      
      console.log('Successfully parsed MYSQL_URL');
    } catch (error) {
      console.error('Error parsing MYSQL_URL:', error.message);
      console.log('Falling back to environment variables');
      
      // Fall back to individual environment variables
      dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'property_listings',
        port: process.env.DB_PORT || 3306,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
    }
  } else {
    console.log('Using individual environment variables for database connection');
    dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'property_listings',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }

  // Log configuration (without sensitive data)
  console.log('Database configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    ssl: dbConfig.ssl ? 'Enabled' : 'Disabled',
    passwordProvided: dbConfig.password ? 'Yes' : 'No'
  });
} catch (error) {
  console.error('Error parsing database configuration:', error);
  connectionError = error;
}

// Create connection pool
let pool;

try {
  if (dbConfig) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Set a connection timeout
      connectTimeout: 10000, // 10 seconds
      // Automatically check connection status
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000, // 10 seconds
    });

    // Test the connection
    console.log('Testing database connection...');
    pool.getConnection()
      .then(connection => {
        console.log('Database connection successful!');
        isConnected = true;
        connection.release();
      })
      .catch(err => {
        console.error('Database connection failed:', err);
        connectionError = err;
      });
  }
} catch (error) {
  console.error('Error creating database pool:', error);
  connectionError = error;
}

// Export the pool and connection status
export { pool, isConnected, connectionError };