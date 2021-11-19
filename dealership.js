require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const assert = require('assert');
const { exit } = require('process');

const nodemailer = require('nodemailer');

//

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seansmodd@gmail.com',
    pass: '2thepack',
  },
});

// Connection URL
const url =
  'mongodb+srv://seanmodd:2thepack@senpexcluster.dn1ks.mongodb.net/strapi?retryWrites=true&w=majority';
// 'mongodb+srv://seanmodd:2thepack@scrapercluster.dn1ks.mongodb.net/mongosenpexretryWrites=true&w=majority';

// Database Name
const dbName = 'strapi';

// Use connect method to connect to the server
MongoClient.connect(url, async (err, client) => {
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  await doScrape(db);
});
// async function doScrape(db) {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ['--headless'],
//   });
//   const page = await browser.newPage();
//   await page.goto('https://learnwebcode.github.io/practice-requests/');
//   const names = ['red', 'green', 'blue'];
//   await fs.writeFileSync('names.txt', names.join('\r\n'));

//   await browser.close();
// }
// doScrape();
const doScrape = async (db) => {
  await (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto('https://www.stevenscreekkia.com/sitemap.htm');
    // await page.goto('https://learnwebcode.github.io/practice-requests/');

    const inventory = await page.evaluate(
      () =>
        Array.from(
          document.querySelectorAll(
            '.inventory-listing-sitemap .content ul li a'
          )
        ).map((x) => x.textContent) // .map((x) => x.textContent)
    );

    await fs.writeFileSync('inventory.txt', inventory.join('\r\n'));
    // console.log('INVENTORY FROM DEALERSHIP.JS', inventory);

    const inventoryURLs = await page.evaluate(
      () =>
        Array.from(
          document.querySelectorAll(
            '.inventory-listing-sitemap .content ul li a'
          )
        ).map((x) => x.href) // .map((x) => x.textContent)
    );
    await fs.writeFileSync('inventoryURLs.txt', inventoryURLs.join('\r\n'));

    // await page.goto(inventoryURLs);

    async function visitAllPages() {
      for (let i = 0; i < inventoryURLs.length; i++) {
        await page.goto(inventoryURLs[i]);

        const singleCar = await page.evaluate(async () => {
          //* SCRAPE car_name AND car_price BELOW
          const [car_name, car_price] = Array.from(
            document.querySelectorAll('.font-weight-bold span')
          ).map((x) => x.textContent); // .map((x) => x.textContent)

          //* SCRAPE car_samplePayment BELOW
          const car_samplePayment = document.querySelector(
            '#sample-payment-value strong'
          ).textContent;

          //* SCRAPE car_carFaxUrl BELOW
          const car_carFaxUrl = document.querySelector('.carfax a').href;

          //* SCRAPE car_samplePaymentDetails BELOW
          const car_samplePaymentDetails = document.querySelector(
            '.payment-summary-support-text'
          ).textContent;

          //* SCRAPE car_exteriorColor BELOW
          const car_exteriorColorLabel =
            document.querySelector('.normalized-swatch');
          const car_exteriorColor =
            car_exteriorColorLabel.nextSibling.textContent;

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

          //* SCRAPE car_vin BELOW
          const car_vin = getElementByXpath(
            "//li[contains(., 'VIN:')]"
          )?.textContent;

          //* SCRAPE car_stock BELOW
          const car_stock = getElementByXpath(
            "//li[contains(., 'Stock:')]"
          )?.textContent;

          //* SCRAPE car_odometer BELOW
          const car_odometer = getElementByXpath(
            "//span[contains(., ' miles')]"
          )?.textContent;

          //* SCRAPE car_views BELOW
          const car_views = getElementByXpath(
            "//li[contains(., ' views in the past')]"
          )?.textContent;

          return {
            car_name,
            car_price,
            car_vin,
            car_stock,
            car_odometer,
            car_views,
            car_exteriorColor,
            car_samplePayment,
            car_samplePaymentDetails,
            car_carFaxUrl,
          };
        });
        console.log('SINGLE CAR FROM DEALERSHIP.JS', singleCar);
        await fs.writeFileSync('singleCar.json', JSON.stringify(singleCar));
      }
    }
    await visitAllPages();

    await browser.close();
  })();
};
