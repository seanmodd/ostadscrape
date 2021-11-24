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

  const carMakeName = await frame.evaluate(() => {
    const tabButtonMake = document.querySelector('#landing__tabs-option-2');
    tabButtonMake.click();
    return tabButtonMake.textContent;
  });
  console.log('This is the carMakeName: ', carMakeName);

  await page.waitForTimeout(1500);
  console.log('NEXT: ');

  const textContentOfMake = await frame.evaluate(() => {
    const allNames = Array.from(
      document.querySelectorAll('.select-input_options_list_option')
    ).map((x) => x.textContent);

    // let myarray = [];
    //     allNames.forEach(function(item) {
    //       myarray.push(item.textContent);
    //     });
    return allNames;
  });
  console.log('This is the textContentOfMake: ', textContentOfMake);

  const textContentOfModel = await frame.evaluate(() => {
    document.querySelectorAll('.select-input_options_list_option');
    const buttonannoying = $x('//*[@id="ymm__model-control_list"]/li');
    const allNames = Array.from(buttonannoying).map((x) => x.textContent);

    // let myarray = [];
    //     allNames.forEach(function(item) {
    //       myarray.push(item.textContent);
    //     });
    return allNames;
  });
  console.log('This is the textContentOfModel: ', textContentOfModel);

  await page.waitForTimeout(2500);
})();
