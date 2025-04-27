const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.next', '.git', 'scripts', 'public'];
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

function findFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file: string) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !excludeDirs.includes(file)) {
      findFiles(filePath, fileList);
    } else if (stat.isFile() && extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function replaceConsoleLogs(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if we have any console logs to replace
  const hasConsoleLogs = /console\.(log|info|warn|error)/g.test(content);
  
  if (hasConsoleLogs) {
    // Add logger import if not present
    if (!content.includes('import logger')) {
      content = `import logger from '@/lib/logger';\n${content}`;
      modified = true;
    }
    
    // Replace console.log with logger.info
    content = content.replace(/console\.log\((.*?)\);/g, (_match: string, args: string) => `logger.info(${args});`);
    
    // Replace console.info with logger.info
    content = content.replace(/console\.info\((.*?)\);/g, (_match: string, args: string) => `logger.info(${args});`);
    
    // Replace console.warn with logger.warn
    content = content.replace(/console\.warn\((.*?)\);/g, (_match: string, args: string) => `logger.warn(${args});`);
    
    // Replace console.error with logger.error, adding context if not present
    content = content.replace(/console\.error\((.*?)\);/g, (_match: string, args: string) => {
      if (args.includes(',')) {
        return `logger.error(${args});`;
      }
      return `logger.error(${args}, { context: 'Error occurred' });`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Modified: ${filePath}`);
    }
  }
}

const files = findFiles('.');
let modifiedCount = 0;
let remainingLogs = 0;

files.forEach((file: string) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('console.log') || content.includes('console.info') || 
      content.includes('console.warn') || content.includes('console.error')) {
    replaceConsoleLogs(file);
    modifiedCount++;
  }
});

console.log(`\nProcessed ${files.length} files`);
console.log(`Modified ${modifiedCount} files`);

// Check for any remaining console logs
files.forEach((file: string) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('console.log') || content.includes('console.info') || 
      content.includes('console.warn') || content.includes('console.error')) {
    remainingLogs++;
    console.log(`Remaining console logs in: ${file}`);
  }
});

console.log(`\nRemaining files with console logs: ${remainingLogs}`); 