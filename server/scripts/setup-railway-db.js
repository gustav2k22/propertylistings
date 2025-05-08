import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

async function setupRailwayDatabase() {
  console.log('=== Railway Database Setup Tool ===');
  
  // Check if MYSQL_URL is present
  if (!process.env.MYSQL_URL) {
    console.error('ERROR: MYSQL_URL environment variable is not set!');
    console.log('Make sure you have added a MySQL database to your Railway project.');
    return;
  }
  
  console.log('MYSQL_URL found in environment variables.');
  
  // Parse the MySQL URL
  try {
    const mysqlUrl = process.env.MYSQL_URL;
    console.log('Parsing MYSQL_URL...');
    
    // Try to parse as URL first
    let dbConfig;
    try {
      const url = new URL(mysqlUrl);
      dbConfig = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        port: url.port,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
      
      // Extract database name without the leading slash
      const database = url.pathname.replace('/', '');
      if (database) {
        dbConfig.database = database;
      }
      
      console.log('Successfully parsed MYSQL_URL as URL');
    } catch (urlError) {
      console.log('URL parsing failed, trying manual parsing...');
      
      // Manual parsing as fallback
      // Format: mysql://username:password@hostname:port/database
      const userPassHostPortDB = mysqlUrl.replace('mysql://', '');
      const [userPass, hostPortDB] = userPassHostPortDB.split('@');
      const [user, password] = userPass.split(':');
      const [hostPort, database] = hostPortDB.split('/');
      const [host, port] = hostPort.split(':');
      
      dbConfig = {
        host,
        user,
        password,
        port,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
      
      if (database) {
        dbConfig.database = database;
      }
      
      console.log('Manual parsing successful');
    }
    
    // Display the parsed configuration (without password)
    console.log('Database configuration:');
    console.log({
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      ssl: dbConfig.ssl ? 'Enabled' : 'Disabled'
    });
    
    // Try to connect to the MySQL server
    console.log('Attempting to connect to MySQL server...');
    
    let connection;
    try {
      // First try connecting without specifying a database
      const serverConfig = { ...dbConfig };
      delete serverConfig.database;
      
      connection = await mysql.createConnection(serverConfig);
      console.log('Successfully connected to MySQL server!');
      
      // Create the database if it doesn't exist
      const dbName = dbConfig.database || 'property_listings';
      console.log(`Checking if database "${dbName}" exists...`);
      
      const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [dbName]
      );
      
      if (rows.length === 0) {
        console.log(`Database "${dbName}" does not exist. Creating it...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database "${dbName}" created successfully.`);
      } else {
        console.log(`Database "${dbName}" already exists.`);
      }
      
      // Switch to the database
      console.log(`Switching to database "${dbName}"...`);
      await connection.query(`USE \`${dbName}\``);
      
      // Create properties table if it doesn't exist
      console.log('Creating properties table if it doesn\'t exist...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS properties (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          location VARCHAR(255) NOT NULL,
          image_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Properties table created or already exists.');
      
      // Check if there are any properties
      const [properties] = await connection.query('SELECT COUNT(*) as count FROM properties');
      const count = properties[0].count;
      
      // Insert sample data if the table is empty
      if (count === 0) {
        console.log('No properties found. Inserting sample data...');
        
        const sampleProperties = [
          {
            title: "Modern Apartment in Downtown",
            description: "A beautiful modern apartment located in the heart of downtown with stunning city views.",
            price: 350000,
            location: "Downtown, City Center",
            image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          },
          {
            title: "Suburban Family Home",
            description: "Spacious family home in a quiet suburban neighborhood.",
            price: 450000,
            location: "Greenfield Suburb",
            image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          },
          {
            title: "Luxury Beachfront Villa",
            description: "Exclusive beachfront villa with panoramic ocean views.",
            price: 1200000,
            location: "Coastal Paradise",
            image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          }
        ];
        
        // Insert each property
        for (const property of sampleProperties) {
          await connection.query(
            'INSERT INTO properties (title, description, price, location, image_url) VALUES (?, ?, ?, ?, ?)',
            [property.title, property.description, property.price, property.location, property.image_url]
          );
        }
        
        console.log('Sample data inserted successfully.');
      } else {
        console.log(`Found ${count} existing properties. No sample data needed.`);
      }
      
      console.log('Database setup completed successfully!');
      
      // Generate a database configuration file
      const configPath = path.join(__dirname, '..', 'config', 'railway-db-config.js');
      const configContent = `// Auto-generated Railway database configuration
// Generated on: ${new Date().toISOString()}

export const railwayDbConfig = {
  host: '${dbConfig.host}',
  user: '${dbConfig.user}',
  password: '${dbConfig.password}',
  database: '${dbConfig.database || 'property_listings'}',
  port: ${dbConfig.port},
  ssl: ${process.env.NODE_ENV === 'production' ? '{ rejectUnauthorized: false }' : 'false'}
};
`;
      
      fs.writeFileSync(configPath, configContent);
      console.log(`Database configuration saved to: ${configPath}`);
      
    } catch (error) {
      console.error('Error connecting to database:', error);
      
      // Provide troubleshooting guidance
      console.log('\n=== Troubleshooting Guide ===');
      console.log('1. Check that your MYSQL_URL is correct');
      console.log('2. Make sure your Railway MySQL add-on is running');
      console.log('3. Verify that your IP is allowed to connect to the database');
      console.log('4. Check if the database user has the correct permissions');
      console.log('\nError details:');
      console.log(error.message);
    } finally {
      if (connection) {
        await connection.end();
        console.log('Database connection closed.');
      }
    }
    
  } catch (error) {
    console.error('Error parsing MYSQL_URL:', error);
  }
}

// Run the setup
setupRailwayDatabase();
