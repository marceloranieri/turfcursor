const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// File paths
const envPath = path.join(__dirname, '.env.local');
const backupPath = path.join(__dirname, '.env.backup');

// Create backup if .env.local exists
if (fs.existsSync(envPath)) {
  console.log('Creating backup of .env.local...');
  fs.copyFileSync(envPath, backupPath);
  console.log('Backup created at .env.backup');
}

// Function to check and restore .env.local
function checkAndRestore() {
  try {
    // Check if .env.local exists
    if (!fs.existsSync(envPath)) {
      console.log('⚠️ .env.local was deleted or moved!');
      
      // Restore from backup if available
      if (fs.existsSync(backupPath)) {
        console.log('Restoring from backup...');
        fs.copyFileSync(backupPath, envPath);
        // Make read-only again
        execSync(`chmod 444 ${envPath}`);
        console.log('✅ .env.local has been restored and protected!');
      } else {
        console.log('❌ No backup found to restore from!');
      }
    }
  } catch (error) {
    console.error('Error in check and restore process:', error);
  }
}

// Run check immediately
checkAndRestore();

// Check every 10 seconds
const interval = setInterval(checkAndRestore, 10000);

console.log('🛡️ ENV file guardian is running. Press Ctrl+C to stop.');
console.log('Monitoring .env.local every 10 seconds...');

// Handle exit gracefully
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('\nGuardian stopped. Your .env.local file is no longer being monitored.');
  process.exit();
});