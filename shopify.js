const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto('https://experts.shopify.com/');
    await page.waitForSelector('.section');

    await page.$$;
    document.querySelectorAll;
  } catch (e) {
    console.log('our error', e);
  }
});
