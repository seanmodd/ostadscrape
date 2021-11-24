const puppeteer = require('puppeteer');

const helperFunctions = () => {
  window.$x = (xPath) =>
    document.evaluate(
      xPath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  const tradeInUrl =
    'https://www.stevenscreekkia.com/carfax-trade-in.htm?itemId=4b73c3110a0e09b1310fd4e9fe0596f9&vehicleId=4b73c3110a0e09b1310fd4e9fe0596f9';
  await page.goto(tradeInUrl);
  // await page.goto('https://en.wikipedia.org', { waitUntil: 'networkidle2' });
  await page.evaluate(helperFunctions);
  await page.waitForTimeout(7000);

  const text = await page.evaluate(() => {
    // $x() is now available
    const buttonMake = $x(document.querySelector('#landing__tabs-option-2'));
    console.log('THis is buttonMake: ', buttonMake);
    return buttonMake.textContent;
  });
  console.log(text);
  await browser.close();
})();
