// Railway database configuration
// This file contains hardcoded credentials for Railway MySQL
// It's used as a fallback when the MYSQL_URL parsing fails

// Get the password from environment variables or use the local password as fallback
// The local password is 'property123' from the .env file
const railwayPassword = process.env.RAILWAY_DB_PASSWORD || process.env.DB_PASSWORD || 'property123';

// Log whether we have a password or not (without revealing it)
console.log(`Railway database password ${railwayPassword ? 'is set' : 'is NOT set'}`);

export const railwayDbConfig = {
  // Use the Railway-provided MySQL credentials
  host: 'nozomi.proxy.rlwy.net',
  port: '29900',
  user: 'root',  // Default Railway user
  password: railwayPassword,  // Use the password from environment variables
  database: 'railway',
  ssl: { rejectUnauthorized: false }
};
