const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const LOCAL_URL = 'http://localhost:3000';

async function checkDevServer() {
  return new Promise((resolve) => {
    http.get(LOCAL_URL, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function checkNextDev() {
  try {
    const { stdout } = await execAsync('ps aux | grep "next dev" | grep -v grep');
    return stdout.length > 0;
  } catch (error) {
    return false;
  }
}

async function checkDevelopment() {
  console.log('Checking development environment...\n');

  const isNextDevRunning = await checkNextDev();
  console.log(`Next.js development server: ${isNextDevRunning ? '✅ Running' : '❌ Not running'}`);

  if (!isNextDevRunning) {
    console.log('\nTo start the development server, run:');
    console.log('npm run dev');
    return;
  }

  const isServerAccessible = await checkDevServer();
  console.log(`Development server accessible: ${isServerAccessible ? '✅ Yes' : '❌ No'}`);

  if (!isServerAccessible) {
    console.log('\nThe Next.js process is running but the server is not accessible.');
    console.log('This might indicate that:');
    console.log('1. The server is still starting up');
    console.log('2. There might be a port conflict');
    console.log('3. The server might have crashed');
    console.log('\nTry restarting the development server:');
    console.log('1. Press Ctrl+C to stop the current server');
    console.log('2. Run: npm run dev');
    return;
  }

  console.log('\n✅ Development environment is running correctly!');
  console.log('You can access the app at:', LOCAL_URL);
}

checkDevelopment().catch(console.error); 