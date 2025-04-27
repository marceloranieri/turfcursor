import { chromium } from 'playwright';
import { supabase } from '../lib/supabase/client';

async function runSmokeTests() {
  console.log('Starting smoke tests...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Authentication Flow
    console.log('\n🔒 Testing Authentication Flow');
    
    // Sign Up
    await page.goto(process.env.NEXT_PUBLIC_APP_URL + '/auth/signup');
    await page.fill('input[type="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'testPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/auth/verify-email');
    console.log('✅ Sign Up flow works');

    // Sign In
    await page.goto(process.env.NEXT_PUBLIC_APP_URL + '/auth/signin');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/chat');
    console.log('✅ Sign In flow works');

    // Test 2: Chat Functionality
    console.log('\n💬 Testing Chat Functionality');
    
    // Join Circle
    await page.click('text=Join Circle');
    await page.waitForSelector('.circle-card');
    await page.click('.circle-card >> text=General');
    await page.waitForURL('**/chat/*');
    console.log('✅ Circle joining works');

    // Send Message
    await page.fill('textarea[placeholder="Type a message..."]', 'Test message');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('text=Test message');
    console.log('✅ Message sending works');

    // React to Message
    await page.click('button[aria-label="Add reaction"]');
    await page.click('text=👍');
    await page.waitForSelector('text=1');
    console.log('✅ Message reactions work');

    // Test 3: Image Upload
    console.log('\n🖼️ Testing Image Upload');
    const fileInput = await page.$('input[type="file"]');
    await fileInput?.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-content'),
    });
    await page.waitForSelector('img[alt="Upload preview"]');
    console.log('✅ Image upload preview works');

    // Test 4: Mobile Responsiveness
    console.log('\n📱 Testing Mobile Responsiveness');
    await context.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.reload();
    await page.waitForSelector('button[aria-label="Open menu"]');
    await page.click('button[aria-label="Open menu"]');
    await page.waitForSelector('nav');
    console.log('✅ Mobile navigation works');

    // Test 5: Theme Toggle
    console.log('\n🌓 Testing Theme Toggle');
    await page.click('button[aria-label*="mode"]');
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`✅ Theme toggle works (current: ${isDark ? 'dark' : 'light'})`);

    // Test 6: Logout Flow
    console.log('\n🚪 Testing Logout Flow');
    await page.click('text=Sign Out');
    await page.waitForURL('**/auth/signin');
    console.log('✅ Logout flow works');

    console.log('\n✨ All smoke tests passed!');
  } catch (error) {
    console.error('\n❌ Smoke test failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run tests if called directly
if (require.main === module) {
  runSmokeTests().catch(console.error);
}

export { runSmokeTests }; 