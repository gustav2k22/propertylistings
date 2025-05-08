// This file forces the application to use mock data in the Railway environment
// It's a simple solution to the database connection issues

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set the USE_MOCK_DATA environment variable to true
process.env.USE_MOCK_DATA = 'true';

console.log('Force mock data mode enabled');
console.log('The application will use mock data instead of trying to connect to a database');

// Export a dummy pool object that will be used when the real database connection fails
const dummyPool = {
  getConnection: () => {
    throw new Error('Mock data mode is enabled, database connection is not available');
  },
  query: () => {
    throw new Error('Mock data mode is enabled, database queries are not available');
  },
  execute: () => {
    throw new Error('Mock data mode is enabled, database execution is not available');
  }
};

// Export the variables that will be used by the application
export const pool = dummyPool;
export const isConnected = false;
export const connectionError = new Error('Mock data mode is enabled');

// Log that the mock data module has been loaded
console.log('Mock data module loaded successfully');
