#!/usr/bin/env node

/**
 * This script checks for circular dependencies in the codebase
 * Run with: node scripts/check-cycles.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for circular dependencies...');

try {
  // Check if madge is installed
  try {
    execSync('npx madge --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('Installing madge...');
    execSync('npm install --save-dev madge', { stdio: 'inherit' });
  }

  // Run madge to check for circular dependencies
  const result = execSync('npx madge --circular .', { encoding: 'utf8' });
  
  if (result.includes('No circular dependencies found')) {
    console.log('✅ No circular dependencies found!');
    process.exit(0);
  } else {
    console.log('⚠️ Circular dependencies found:');
    console.log(result);
    
    // Save the report to a file
    const reportPath = path.join(process.cwd(), 'circular-deps-report.txt');
    fs.writeFileSync(reportPath, result);
    console.log(`\nReport saved to: ${reportPath}`);
    
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error checking for circular dependencies:', error.message);
  process.exit(1);
} 