// This file is used to ensure Vercel uses the correct deployment configuration
// Last updated: 2025-04-29

module.exports = {
  // Build configuration
  buildCommand: 'npm install --legacy-peer-deps && npm run build',
  installCommand: 'npm install --no-optional --legacy-peer-deps',
  
  // Environment variables
  env: {
    HUSKY_SKIP_INSTALL: '1'
  },
  
  // Framework settings
  framework: 'nextjs',
  
  // GitHub settings
  github: {
    silent: true
  }
}; 