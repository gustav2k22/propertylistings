// Auto-generated Railway database configuration
// Generated on: 2025-05-08T17:13:32.332Z

export const railwayDbConfig = {
  // Get the host from the appropriate environment variables
  host: process.env.RAILWAY_MYSQL_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST,
  // Get the user from the appropriate environment variables
  user: process.env.RAILWAY_MYSQL_USER || process.env.MYSQLUSER || process.env.MYSQL_USER,
  // Get the password from the appropriate environment variables
  password: process.env.RAILWAY_MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD,
  // Get the database from the appropriate environment variables
  database: process.env.RAILWAY_MYSQL_DATABASE || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
  // Get the port from the appropriate environment variables
  port: parseInt(process.env.RAILWAY_MYSQL_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306', 10),
  // Always use SSL for Railway connections
  ssl: { rejectUnauthorized: false }
};
