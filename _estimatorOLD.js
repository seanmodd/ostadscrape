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
  // await page.waitForTimeout(7000);

  console.log('waiting for iframe with form to be ready.');
  // const myiframe = await page.waitForSelector('#4955ca501f_mja6nty6mdk');
  console.log('iframe is ready. Loading iframe content');
  const frames = await page.frames();
  // console.log('THis is frames: ', frames);
  const frame = frames[0];
  await frame.waitForSelector('#landing__tabs-option-2');
  const stupidbutton = await frame.querySelector('#landing__tabs-option-2');
  console.log('THIS IS THE STUPID BUTTON FROM THE IFRAME: ', stupidbutton);
  frame.click('#landing__tabs-option-2');
  
  await browser.close();
})();
