const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36'
    );

    await page.goto('https://experts.shopify.com/');
    await page.waitForSelector('.section');

    const sections = await page.$$('.section');

    for (const section of sections) {
      const button = await section.$('a.marketing-button');
      button.click();
    }
  } catch (e) {
    console.log('our error', e);
  }
});
