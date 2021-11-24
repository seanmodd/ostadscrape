// Still need to scrape all of carfax data IF it's available
// Still need to scrape the available specials, if any for a given car!
// Need to create a like or dislike button for each car!
// Need to create a calculator for the payment calculation!
//* Connect and add the pop up calculator for the payment calculation! Dialog box?
//* Connect and add the "Apply for Financing" to the one on https://www.stevenscreekkia.com !!!
// Add a table with carfax info for each car - have it set up like a FAQ at the bottom of each car
// Add to a node server with a cron job that runs every morning
//* Connect and add the CarFax trade-in form from here: https://www.stevenscreekkia.com/carfax-trade-in.htm?itemId=4b73c3110a0e09b1310fd4e9fe0596f9&vehicleId=4b73c3110a0e09b1310fd4e9fe0596f9
//* Ask Jayen if this can be added to NextJS within the api folder!
// ? This way the api can be easily accessed directly from within NextJS as well as Strapi...
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

//

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seansmodd@gmail.com',
    pass: '2thepack',
  },
});
const mailOptions = {
  from: 'seansmodd@gmail.com',
  to: 'sean@senpex.com',
  subject: `new car added: }`,
  text: `here is the new car: `,
};

transporter.sendMail(mailOptions, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('email sent');
  }
});

// Connection URL
const url =
  'mongodb+srv://seanmodd:2thepack@senpexcluster.dn1ks.mongodb.net/strapi?retryWrites=true&w=majority';

// Database Name
const dbName = 'strapi';

// Now must sync with MongoDB
// Use connect method to connect to the server
MongoClient.connect(url, async (err, client) => {
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  await doScrape(db);
});

const doScrape = async (db) => {
  await (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto('https://www.stevenscreekkia.com/');
    // await page.goto(
    //   'https://www.stevenscreekkia.com/carfax-trade-in.htm?itemId=4b73c3110a0e09b1310fd4e9fe0596f9&vehicleId=4b73c3110a0e09b1310fd4e9fe0596f9'
    // );
    await page.waitForTimeout(2000);

    // await page.click('#landing__tabs-option-2', { delay: 5 });
    // await page.click('#ddc-span6 h4', { delay: 5 });

    // await page.waitForTimeout(2000);
    // const carMakes = await page.evaluate(
    //   () =>
    //     Array.from(
    //       document.querySelectorAll('.select-input_options_list li')
    //     ).map((x) => x.textContent) // .map((x) => x.textContent)
    // );
    // await page.waitForTimeout(2000);
    // await fs.writeFileSync('carMakes.txt', carMakes.join('\r\n'));
    // await page.waitForTimeout(2000);
    // console.log('These are the carMakes: ', carMakes);

    async function visitAllPages() {
      const tradeInUrl =
        'https://www.stevenscreekkia.com/carfax-trade-in.htm?itemId=4b73c3110a0e09b1310fd4e9fe0596f9&vehicleId=4b73c3110a0e09b1310fd4e9fe0596f9';
      await page.goto(tradeInUrl);

      await page.waitForTimeout(5000);
      //* array.from and query selector all
      const buttonSelector = await page.evaluate(() => {
        const buttongood = document.querySelector(
          'button#landing__tabs-option-2.button-bar_option.button'
        );
        console.log('here is buttongood: ', buttongood);
        const buttongoodtext = buttongood.textContent;
        console.log('here is buttongoodtext: ', buttongoodtext);
      });
      //   const makeButton = document.querySelector('#landing__tabs-option-2');
      //   makeButton.click();
      // });
      console.log('This is the buttonSelector: ', buttonSelector);
      await page.waitForTimeout(2000);
      page.click(buttonSelector);
      // const [car_makeNames] = Array.from(
      //   document.querySelectorAll('.select-input_options_list li')
      // ).map((x) => x);

      //* query selector with textContent
      // const car_samplePayment =
      //   document.querySelector('#sample-payment-value strong')?.textContent ||
      //   null;

      //* query selector for next sibling with text content
      // const car_exteriorColorLabel =
      //   document.querySelector('.normalized-swatch');
      // const car_exteriorColor =
      //   car_exteriorColorLabel?.nextSibling.textContent ||
      //   'no exterior color';

      //* getElementByXpath function is below...

      function getElementByXpath(path) {
        return document.evaluate(
          path,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
      }

      //* finding the element via the xpath
      const car_sampleButton =
        getElementByXpath("//button[contains('MAKE')]").textContent || 'no vin';

      console.log('mysample: ', mysample);
      return {
        // car_makeNames,
        car_sampleButton,
        // car_exteriorColor,
        // car_samplePayment,
      };
    }

    await visitAllPages();
    console.log('carMakeInfo CAR FROM DEALERSHIP.JS', visitAllPages);

    await browser.close();
  })();
};
