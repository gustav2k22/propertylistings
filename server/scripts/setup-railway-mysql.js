import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Read SQL files
const schemaPath = path.join(__dirname, '..', 'config', 'schema.sql');
const sampleDataPath = path.join(__dirname, '..', 'config', 'sample_data.sql');

const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
const sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8');

// Function to execute SQL statements
async function executeSQL(connection, sql) {
  const statements = sql
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  for (const statement of statements) {
    try {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await connection.query(`${statement};`);
      console.log('Statement executed successfully');
    } catch (error) {
      console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
      console.error(error.message);
      
      // If the error is about the database already existing, we can continue
      if (error.message.includes('database exists')) {
        console.log('Database already exists, continuing...');
      } else {
        throw error;
      }
    }
  }
}

async function setupRailwayDatabase() {
  console.log('=== Railway MySQL Database Setup ===');
  
  // Check for Railway environment variables
  const mysqlHost = process.env.MYSQLHOST || process.env.DB_HOST;
  const mysqlPort = process.env.MYSQLPORT || process.env.DB_PORT;
  const mysqlUser = process.env.MYSQLUSER || process.env.DB_USER;
  const mysqlPassword = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
  const mysqlDatabase = process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway';
  
  if (!mysqlHost || !mysqlUser) {
    console.error('ERROR: MySQL connection details not found in environment variables');
    console.log('Make sure you have the following variables set:');
    console.log('- MYSQLHOST or DB_HOST');
    console.log('- MYSQLPORT or DB_PORT');
    console.log('- MYSQLUSER or DB_USER');
    console.log('- MYSQLPASSWORD or DB_PASSWORD');
    return;
  }
  
  console.log('MySQL connection details:');
  console.log(`Host: ${mysqlHost}`);
  console.log(`Port: ${mysqlPort}`);
  console.log(`User: ${mysqlUser}`);
  console.log(`Database: ${mysqlDatabase}`);
  
  let connection;
  
  try {
    // Connect to MySQL server without specifying a database
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: mysqlHost,
      port: mysqlPort,
      user: mysqlUser,
      password: mysqlPassword,
      ssl: { rejectUnauthorized: false },
      multipleStatements: true
    });
    
    console.log('Connected to MySQL server successfully');
    
    // Modify schema SQL to use the Railway database name
    const modifiedSchemaSQL = schemaSQL
      .replace(/CREATE DATABASE IF NOT EXISTS property_listings;/g, `CREATE DATABASE IF NOT EXISTS \`${mysqlDatabase}\`;`)
      .replace(/USE property_listings;/g, `USE \`${mysqlDatabase}\`;`);
    
    // Modify sample data SQL to use the Railway database name
    const modifiedSampleDataSQL = sampleDataSQL
      .replace(/USE property_listings;/g, `USE \`${mysqlDatabase}\`;`);
    
    // Execute schema SQL
    console.log('Creating database and tables...');
    await executeSQL(connection, modifiedSchemaSQL);
    
    // Execute sample data SQL
    console.log('Inserting sample data...');
    await executeSQL(connection, modifiedSampleDataSQL);
    
    console.log('Database setup completed successfully!');
    
    // Update the environment variable to disable mock data mode
    console.log('Updating environment to use real database...');
    process.env.USE_MOCK_DATA = 'false';
    
    // Create a configuration file for the database
    const configPath = path.join(__dirname, '..', 'config', 'railway-db-config.js');
    const configContent = `// Auto-generated Railway database configuration
// Generated on: ${new Date().toISOString()}

export const railwayDbConfig = {
  host: '${mysqlHost}',
  user: '${mysqlUser}',
  password: '${mysqlPassword}',
  database: '${mysqlDatabase}',
  port: ${mysqlPort},
  ssl: { rejectUnauthorized: false }
};
`;
    
    fs.writeFileSync(configPath, configContent);
    console.log(`Database configuration saved to: ${configPath}`);
    
  } catch (error) {
    console.error('Error setting up database:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your MySQL credentials are correct');
    console.log('2. Make sure your Railway MySQL service is running');
    console.log('3. Verify that your IP is allowed to connect to the database');
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the setup
setupRailwayDatabase();
