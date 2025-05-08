import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to update the railway-db-config.js file with the provided password
function updateRailwayConfig(password) {
  const configPath = path.join(__dirname, '..', 'config', 'railway-db-config.js');
  
  try {
    // Read the current file
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Replace the password line
    content = content.replace(
      /password: .*?,/,
      `password: '${password}',  // Password set by set-railway-password.js script`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(configPath, content);
    
    console.log('\n✅ Railway database password has been set successfully!');
    console.log(`The configuration file has been updated: ${configPath}`);
    
    // Create a .env.railway file with the password
    const envPath = path.join(__dirname, '..', '..', '.env.railway');
    const envContent = `# Railway environment variables
# Generated on: ${new Date().toISOString()}
NODE_ENV=production
RAILWAY_DB_PASSWORD=${password}
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(`\nA .env.railway file has been created with the password: ${envPath}`);
    console.log('\nIMPORTANT: Make sure to add this password to your Railway environment variables:');
    console.log('1. Go to your Railway project dashboard');
    console.log('2. Click on your web service');
    console.log('3. Go to the "Variables" tab');
    console.log('4. Add a new variable: RAILWAY_DB_PASSWORD');
    console.log(`5. Set the value to: ${password}`);
    
  } catch (error) {
    console.error('Error updating configuration file:', error);
  }
}

// Main function
function main() {
  console.log('=== Railway Database Password Setup Tool ===');
  console.log('This tool will help you set the password for your Railway MySQL database.');
  console.log('The password will be saved in your configuration files.');
  
  rl.question('\nEnter your Railway MySQL password: ', (password) => {
    if (!password) {
      console.log('❌ Password cannot be empty. Please try again.');
      rl.close();
      return;
    }
    
    // Update the configuration with the provided password
    updateRailwayConfig(password);
    
    rl.close();
  });
}

// Run the main function
main();
