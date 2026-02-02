const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3030/8');
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: 'slide2.png' });
  await browser.close();
  console.log('Screenshot saved to slide2.png');
})();
