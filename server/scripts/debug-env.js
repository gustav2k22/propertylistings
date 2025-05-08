import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Environment Variables Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('\n=== Railway Detection ===');
console.log('RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
console.log('RAILWAY_SERVICE_NAME:', process.env.RAILWAY_SERVICE_NAME);

console.log('\n=== Railway MySQL Variables ===');
console.log('MYSQLHOST:', process.env.MYSQLHOST);
console.log('MYSQLPORT:', process.env.MYSQLPORT);
console.log('MYSQLUSER:', process.env.MYSQLUSER);
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '******** (set)' : '(not set)');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE);
console.log('MYSQL_URL:', process.env.MYSQL_URL ? '******** (set)' : '(not set)');

console.log('\n=== Fallback Database Variables ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******** (set)' : '(not set)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_SSL:', process.env.DB_SSL);

console.log('\n=== Calculated Database Config ===');
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

console.log('host:', dbConfig.host);
console.log('user:', dbConfig.user);
console.log('password:', dbConfig.password ? '******** (set)' : '(not set)');
console.log('database:', dbConfig.database);
console.log('port:', dbConfig.port);
console.log('ssl:', dbConfig.ssl ? 'Enabled' : 'Disabled');
