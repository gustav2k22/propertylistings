import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createRailwayUser() {
  console.log('=== Railway MySQL User Creation Tool ===');
  
  // Get the root password
  const rootPassword = await new Promise(resolve => {
    rl.question('Enter your Railway MySQL root password: ', answer => {
      resolve(answer);
    });
  });
  
  // Get the new username
  const newUsername = await new Promise(resolve => {
    rl.question('Enter the new username to create (default: property_user): ', answer => {
      resolve(answer || 'property_user');
    });
  });
  
  // Get the new password
  const newPassword = await new Promise(resolve => {
    rl.question('Enter the password for the new user (default: property123): ', answer => {
      resolve(answer || 'property123');
    });
  });
  
  console.log(`\nCreating user ${newUsername} on Railway MySQL...`);
  
  let connection;
  try {
    // Connect to MySQL as root
    connection = await mysql.createConnection({
      host: 'nozomi.proxy.rlwy.net',
      port: '29900',
      user: 'root',
      password: rootPassword,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('Connected to MySQL as root');
    
    // Create the database if it doesn't exist
    console.log('Creating database if it doesn\'t exist...');
    await connection.query('CREATE DATABASE IF NOT EXISTS railway');
    
    // Create the user with privileges from any host
    console.log(`Creating user ${newUsername}...`);
    await connection.query(`CREATE USER IF NOT EXISTS '${newUsername}'@'%' IDENTIFIED BY '${newPassword}'`);
    
    // Grant privileges
    console.log('Granting privileges...');
    await connection.query(`GRANT ALL PRIVILEGES ON railway.* TO '${newUsername}'@'%'`);
    await connection.query('FLUSH PRIVILEGES');
    
    console.log('\n✅ User created successfully!');
    console.log('\nUpdate your .env.railway file with these credentials:');
    console.log(`DB_USER=${newUsername}`);
    console.log(`DB_PASSWORD=${newPassword}`);
    console.log(`RAILWAY_DB_PASSWORD=${newPassword}`);
    
    // Create a config file with the new credentials
    console.log('\nNow update your Railway environment variables with these values.');
    
  } catch (error) {
    console.error('Error creating user:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure the root password is correct');
    console.log('2. Verify that your Railway MySQL service is running');
    console.log('3. Check if you have the necessary privileges to create users');
  } finally {
    if (connection) {
      await connection.end();
    }
    rl.close();
  }
}

createRailwayUser();
