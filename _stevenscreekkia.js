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
      headless: true,
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
    // making sure all urls are unique!
    const unique = (value, index, self) => self.indexOf(value) === index;
    const uniqueInventoryURLs = inventoryURLs.filter(unique);
    await fs.writeFileSync(
      'inventoryURLs.txt',
      uniqueInventoryURLs.join('\r\n')
    );

    // await page.goto(inventoryURLs);

    async function visitAllPages() {
      for (let i = 0; i < uniqueInventoryURLs.length; i++) {
        await page.goto(uniqueInventoryURLs[i]);
        console.log(
          'This is the inventoryURLs.length: ',
          uniqueInventoryURLs.length
        );
        console.log('This is the i number: ', i);
        console.log('This is the inventoryURLs[i]: ', uniqueInventoryURLs[i]);
        // we have to loop through the unique inventoryURLs and visit each one

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

          //* SCRAPE car_samplePaymentDetails_Months BELOW
          const monthsRegex = /(\d){2}/g;

          const car_samplePaymentDetails_MonthsExtract =
            car_samplePaymentDetails.match(monthsRegex);
          const car_samplePaymentDetails_Months =
            car_samplePaymentDetails_MonthsExtract[0];

          //* SCRAPE car_samplePaymentDetails_APR BELOW
          const aprRegex = /([\-\+]{0,1}\d[\d\.\,]*[\.\,][\d\.\,]*\d+)/g;

          const car_samplePaymentDetails_APRExtract =
            car_samplePaymentDetails.match(aprRegex);
          const car_samplePaymentDetails_APR =
            car_samplePaymentDetails_APRExtract[0];

          //* SCRAPE car_samplePaymentDetails_DownPayment BELOW

          const downPaymentRegex = /([[\d\,]{1}[\,][\d\.\,]*\d+)/g;

          const car_samplePaymentDetails_DownPaymentExtract =
            car_samplePaymentDetails.match(downPaymentRegex);
          const car_samplePaymentDetails_DownPayment =
            car_samplePaymentDetails_DownPaymentExtract[0];

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
            car_samplePaymentDetails_Months,
            car_samplePaymentDetails_APR,
            car_samplePaymentDetails_DownPayment,
            car_carFaxUrl,
            car_imgSrcUrl0,
            car_imgSrcUrl1,
            car_imgSrcUrl2,
            car_imgSrcUrl3,
            car_imgSrcUrl4,
          };
        });
        console.log('SINGLE CAR FROM DEALERSHIP.JS', singleCar);
        // now trying to add to MongoDB
        for (const i in singleCar) {
          const res = singleCar;
          if (!res.car_vin) continue;
          console.log(res);
          const query = { car_vin: res.car_vin };
          // const query = { name: "Deli Llama" };

          const update = { $set: res };
          const options = { upsert: true };
          try {
            const item = await db.collection('strapi').findOne(query);
            if (!item) {
              // send email here
              // ? ••••••••••••••••••••••••••••••••••••••••••••••••••••••••• Below is details of the email being sent •••••••••••••••••••••••••••••••••••••••••••••••••••••••••
              const mailOptions = {
                from: 'seansmodd@gmail.com',
                to: 'sean@senpex.com',
                subject: `new car added: ${res.title}`,
                text: `here is the new car: ${JSON.stringify(res)}`,
              };

              transporter.sendMail(mailOptions, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('email sent');
                }
              });
            }
            db.collection('strapi').updateOne(query, update, options);
          } catch (ex) {}
        }

        // below we are now trying to add to local singleCar.json file
        await fs.writeFileSync('singleCar.json', JSON.stringify(singleCar));
      }
    }

    await visitAllPages();

    await browser.close();
  })();
};
