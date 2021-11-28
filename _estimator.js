const puppeteer = require('puppeteer');

const { getModels } = require('./_carfaxApiMake');
const { getModelsWithYears } = require('./_carfaxApiModelandYears');

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

  //* Below is what clicks on the Make Button within the iFrame
  const myTab = await frame.evaluate(() => {
    const tabButtonMake = document.querySelector('#landing__tabs-option-2');
    tabButtonMake.click();
    return tabButtonMake.innerHTML;
  });
  console.log('This is the tabButtonMake: ', myTab);
  await page.waitForTimeout(1500);

  //* Below we are gathering the text content from the Make input, not the list of cars
  const textContentOfMake = await frame.evaluate(() => {
    const allNames = Array.from(
      document.querySelectorAll('.select-input_options_list_option')
    ).map((x) => x.textContent);
    return allNames;
  });
  // console.log('This is the textContentOfMake: ', textContentOfMake);
  //! Now we need to loop through each then create json object for model, make, and year
  for (let i = 0; i < textContentOfMake.length; i++) {
    const make = textContentOfMake[i];
    const model = await getModels(textContentOfMake[i]);
    // console.log('This is the make 📭📭📭📭📭📭📭📭📭📭: ', make);
    // console.log('This is the models 📳📳📳📳📳📳📳: ', model);
    const modelsWithYears = await getModelsWithYears(make, model[i]);
    // console.log(
    //   'This is the modelsWithYears 🤼‍♂️🤼‍♂️🤼‍♂️🤼‍♂️🤼‍♂️🤼‍♂️🤼‍♂️: ',
    //   modelsWithYears
    // );
  }

  await page.waitForTimeout(2500);
})();

//
