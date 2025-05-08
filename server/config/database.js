import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let dbConfig;

if (process.env.MYSQL_URL) {
  // Parse the Railway URL
  const url = new URL(process.env.MYSQL_URL);
  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    port: url.port,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'property_listings',
    port: process.env.DB_PORT || 3306,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  };
}

export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}); 