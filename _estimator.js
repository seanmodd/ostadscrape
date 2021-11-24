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

const framehelperFunctions = () => {
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
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
  const page = await browser.newPage();
  await page.evaluate(helperFunctions);
  const tradeInUrl =
    'https://www.stevenscreekkia.com/carfax-trade-in.htm?itemId=4b73c3110a0e09b1310fd4e9fe0596f9&vehicleId=4b73c3110a0e09b1310fd4e9fe0596f9';
  await page.goto(tradeInUrl);
  await page.waitForTimeout(1000);
  const elementHandle = await page.$('.zoid-visible');
  const frame = await elementHandle.contentFrame();
  await page.waitForTimeout(1500);
  console.log('NOW WE ARE GOING INTO THE iFrame: ');
  await page.waitForTimeout(1500);
  await frame.evaluate(framehelperFunctions);
  await frame.waitForSelector('#landing__tabs-option-2');

  const myTab = await frame.evaluate(() => {
    const tabButtonMake = document.querySelector('#landing__tabs-option-2');
    tabButtonMake.click();
    return tabButtonMake.innerHTML;
  });
  console.log('This is the tabButtonMake: ', myTab);
  // console.log('This is the tabButtonMake: ', myTab.innerText);

  const dropdownData = await frame.evaluate(() => {
    const buttonannoying = $x('//*[@id="ymm__make-control_button"]');
    return buttonannoying.textContent;
  });
  console.log('This is the dropdownData: ', dropdownData);
  // console.log('This is the dropdownData: ', dropdownData.innerHTML);
  // console.log('This is the dropdownData: ', dropdownData.innerText);
  // console.log('This is the dropdownData: ', dropdownData.textContent);
  // console.log('This is the dropdownData: ', dropdownData.text);

  await page.waitForTimeout(1500);
  console.log('NEXT: ');

  await frame.evaluate(() => {
    const idk = document.querySelector(
      '#ymm__make-control_list > li:nth-child(4)'
    );
    console.log(idk);
  });
  // console.log('here is the myData await: ', myData);

  await page.waitForTimeout(2500);
})();
