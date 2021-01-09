const puppeteer = require('puppeteer');

(async function () {
  //first line starts the chrome headless browser
  const browser = await puppeteer.launch();
  //now you create a new page or new tab
  const page = await browser.newPage();
  //then you navigate to that page and enter the url
  await page.goto('https://example.com');
  //takes a screenshot and saves it in the local directory
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
