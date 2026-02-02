const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3030/2?clicks=3');
  await page.waitForTimeout(2000);

  // Click on the image to trigger fullscreen
  await page.click('img[src*="diagram"]');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'slide2-fullscreen.png' });
  await browser.close();
  console.log('Fullscreen screenshot saved to slide2-fullscreen.png');
})();
