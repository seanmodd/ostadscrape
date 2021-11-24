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
  await page.evaluate(helperFunctions);
  const tradeInUrl =
    'https://www.stevenscreekkia.com/carfax-trade-in.htm?itemId=4b73c3110a0e09b1310fd4e9fe0596f9&vehicleId=4b73c3110a0e09b1310fd4e9fe0596f9';
  await page.goto(tradeInUrl);
  await page.waitForTimeout(5000)
  await page.waitForSelector('iframe#\38 d31ff6807_mje6mtm6nte');

  const elementHandle = await page.$(
    // '#zoid-cfx-smc-frame-b767903f2f_mje6mtm6nte iframe'
    'iframe#\38 d31ff6807_mje6mtm6nte'
  );

  // #\38 d31ff6807_mje6mtm6nte
  // 8d31ff6807_mje6mtm6nte

  const frame = await elementHandle.contentFrame();
  console.log('This is the frame: ', frame);
})();
