const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com/?');
  await page.screenshot({ path: 'books.png' });

  await browser.close();
})();
