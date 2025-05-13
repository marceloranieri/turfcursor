const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to search for
const patterns = [
  'console\\.log\\(',
  'console\\.error\\(',
  'console\\.warn\\(',
  'debugger;',
  '// TODO:',
  '// FIXME:',
  '// DEBUG:',
];

// File extensions to check
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

// Directories to exclude
const excludeDirs = ['node_modules', '.next', '.git', 'scripts'];

function findFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          traverse(fullPath);
        }
      } else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];
  
  patterns.forEach(pattern => {
    const regex = new RegExp(pattern, 'g');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const lines = content.slice(0, match.index).split('\n');
      const line = lines.length;
      issues.push({
        pattern,
        line,
        match: match[0],
      });
    }
  });
  
  return issues;
}

// Get workspace root
const workspaceRoot = process.cwd();

// Find all relevant files
console.log('Scanning files...');
const files = findFiles(workspaceRoot);

// Check each file
let totalIssues = 0;
const fileIssues = {};

files.forEach(file => {
  const relativePath = path.relative(workspaceRoot, file);
  const issues = checkFile(file);
  
  if (issues.length > 0) {
    fileIssues[relativePath] = issues;
    totalIssues += issues.length;
  }
});

// Report findings
console.log('\nDevelopment Code Scan Results:');
console.log('=============================');

if (totalIssues === 0) {
  console.log('✅ No development-only code found!');
} else {
  console.log(`⚠️  Found ${totalIssues} instance(s) of development code:`);
  
  Object.entries(fileIssues).forEach(([file, issues]) => {
    console.log(`\n📁 ${file}:`);
    issues.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.match}`);
    });
  });
  
  console.log('\nPlease review and clean up these instances before deployment.');
}

// Check for unused files
console.log('\nChecking for unused files...');
try {
  const unusedOutput = execSync('npx next-unused').toString();
  console.log(unusedOutput);
} catch (error) {
  console.log('Could not check for unused files. Make sure next-unused is configured.');
}

// Verify environment variables
console.log('\nVerifying environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.log(`  - ${envVar}`));
} else {
  console.log('✅ All required environment variables are set.');
} 