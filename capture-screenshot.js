const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set a larger viewport for better screenshot
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the page
  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
  } catch (error) {
    console.error('Error navigating to page:', error);
    await browser.close();
    process.exit(1);
  }

  // Wait a bit for animations to complete
  await page.waitForTimeout(2000);

  // Take a full page screenshot
  await page.screenshot({
    path: 'landing-page-screenshot.png',
    fullPage: true
  });

  console.log('Screenshot saved as landing-page-screenshot.png');

  await browser.close();
})();