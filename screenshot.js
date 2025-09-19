const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to capture a full desktop view
  await page.setViewportSize({ width: 1280, height: 720 });

  // Navigate to the page
  await page.goto('http://localhost:3000');

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  // Take a screenshot of the full page
  await page.screenshot({
    path: 'landing-page-screenshot.png',
    fullPage: true
  });

  console.log('Screenshot saved as landing-page-screenshot.png');

  await browser.close();
})();