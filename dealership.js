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

// Database Name
const dbName = 'strapi';

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
    await page.goto('https://www.stevenscreekkia.com/sitemap.htm');

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
          const car_currentCarURL = window.location.href || null;

          //* SCRAPE car_imgSrcUrl BELOW

          const car_imgSrcUrlAll = document
            .querySelectorAll('.slider img')
            .map((x) => x.src); // .map((x) => x.textContent)

          const car_imgSrcUrl = car_imgSrcUrlAll.filter(
            (x) =>
              x.includes('/pictures.dealer.com/') ||
              x.includes('/images.dealer.com/') ||
              null
          );
          const car_imgSrcUrl0 = car_imgSrcUrl[0] || null;
          const car_imgSrcUrl1 = car_imgSrcUrl[1] || null;
          const car_imgSrcUrl2 = car_imgSrcUrl[2] || null;
          const car_imgSrcUrl3 = car_imgSrcUrl[3] || null;
          const car_imgSrcUrl4 = car_imgSrcUrl[4] || null;

          // const [car_imgSrcUrl] = Array.from(
          //   document.querySelectorAll('.slider img')
          // ).map((x) => x.src); // .map((x) => x.textContent)

          // car_imgSrcUrl.forEach((element) => {
          //   console.log(element);
          // });

          //* SCRAPE car_name AND car_price BELOW
          const [car_name, car_price] = Array.from(
            document.querySelectorAll('.font-weight-bold span')
          ).map((x) => x?.textContent); // .map((x) => x.textContent)

          //* SCRAPE car_samplePayment BELOW
          const car_samplePayment =
            document.querySelector('#sample-payment-value strong')
              ?.textContent || null;

          //* SCRAPE car_carFaxUrl BELOW
          const car_carFax = document.querySelector('.carfax a');
          const car_carFaxUrl = car_carFax
            ? car_carFax.href
            : 'missing carfax report';

          //* SCRAPE car_samplePaymentDetails BELOW
          const car_samplePaymentDetailsTextContent = document.querySelector(
            '.payment-summary-support-text'
          );
          const car_samplePaymentDetails = car_samplePaymentDetailsTextContent
            ? car_samplePaymentDetailsTextContent.textContent
            : 'missing payment details';

          //* SCRAPE car_exteriorColor BELOW
          const car_exteriorColorLabel =
            document.querySelector('.normalized-swatch');
          const car_exteriorColor =
            car_exteriorColorLabel?.nextSibling.textContent ||
            'no exterior color';

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
          const car_vin =
            getElementByXpath("//li[contains(., 'VIN:')]")?.textContent ||
            'no vin';

          //* SCRAPE car_stock BELOW
          const car_stock =
            getElementByXpath("//li[contains(., 'Stock:')]")?.textContent ||
            'no stock';

          //* SCRAPE car_odometer BELOW
          const car_odometer =
            getElementByXpath("//span[contains(., ' miles')]")?.textContent ||
            'no odometer';

          //* SCRAPE car_views BELOW
          const car_views =
            getElementByXpath("//li[contains(., ' views in the past')]")
              ?.textContent || 'no views';

          return {
            car_currentCarURL,
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
            car_imgSrcUrl0,
            car_imgSrcUrl1,
            car_imgSrcUrl2,
            car_imgSrcUrl3,
            car_imgSrcUrl4,
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
