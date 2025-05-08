import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration for database connection
const dbConfig = {
  // If MYSQL_URL is provided (Railway), use it
  // Otherwise, use individual connection parameters
  connectionString: process.env.MYSQL_URL,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Create a connection pool
const createPool = async () => {
  try {
    // If Railway MySQL URL exists, use it
    if (dbConfig.connectionString) {
      console.log('Using Railway MySQL connection string');
      return mysql.createPool(dbConfig.connectionString);
    }
    
    // Otherwise use local connection details
    console.log('Using local MySQL connection parameters');
    return mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

// Export the pool to be used in other modules
const pool = await createPool();

export default pool;
