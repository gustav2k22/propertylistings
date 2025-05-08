import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database setup script
async function setupDatabase() {
  console.log('Starting database setup...');
  
  let connection;
  
  try {
    // Parse connection info from environment variables
    let dbConfig;
    
    if (process.env.MYSQL_URL) {
      console.log('Using MYSQL_URL for database connection');
      const url = new URL(process.env.MYSQL_URL);
      dbConfig = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        port: url.port,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
      
      // Extract database name without the leading slash
      const database = url.pathname.replace('/', '');
      
      // Connect without specifying a database first
      console.log('Connecting to MySQL server...');
      connection = await mysql.createConnection(dbConfig);
      
      // Check if database exists
      console.log(`Checking if database "${database}" exists...`);
      const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [database]
      );
      
      if (rows.length === 0) {
        // Create database if it doesn't exist
        console.log(`Database "${database}" does not exist. Creating it...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        console.log(`Database "${database}" created successfully.`);
      } else {
        console.log(`Database "${database}" already exists.`);
      }
      
      // Switch to the database
      console.log(`Switching to database "${database}"...`);
      await connection.query(`USE \`${database}\``);
    } else {
      // Use individual environment variables
      console.log('Using individual environment variables for database connection');
      dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'property_listings',
        port: process.env.DB_PORT || 3306,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
      
      // Connect directly to the database
      console.log(`Connecting to database "${dbConfig.database}"...`);
      connection = await mysql.createConnection(dbConfig);
    }
    
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
          description: "A beautiful modern apartment located in the heart of downtown with stunning city views. Features include hardwood floors, stainless steel appliances, and a spacious balcony.",
          price: 350000,
          location: "Downtown, City Center",
          image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
          title: "Suburban Family Home",
          description: "Spacious family home in a quiet suburban neighborhood. Features 4 bedrooms, 3 bathrooms, a large backyard, and a two-car garage. Perfect for growing families.",
          price: 450000,
          location: "Greenfield Suburb",
          image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
          title: "Luxury Beachfront Villa",
          description: "Exclusive beachfront villa with panoramic ocean views. Features include a private pool, 5 bedrooms, gourmet kitchen, and direct beach access. The ultimate luxury living experience.",
          price: 1200000,
          location: "Coastal Paradise",
          image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
        },
        {
          title: "Cozy Mountain Cabin",
          description: "Charming cabin nestled in the mountains. Features a stone fireplace, wooden beams, and a wraparound deck with stunning forest views. Perfect for nature lovers.",
          price: 275000,
          location: "Mountain Heights",
          image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        },
        {
          title: "Urban Loft Apartment",
          description: "Stylish loft apartment in a converted warehouse. Features high ceilings, exposed brick walls, and large windows. Located in a trendy neighborhood with easy access to restaurants and shops.",
          price: 320000,
          location: "Arts District",
          image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup
setupDatabase();
