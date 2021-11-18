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

const doScrape = async (db) => {
  await (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto('https://www.stevenscreekkia.com/sitemap.htm');

    const max = 1;
    let iteration = 1;
    const resData = [];
    // ? ••••••••••••••••••• Below is very CONFUSING... ask Omid! •••••••••••••••••••
    while (true) {
      const data = await page.$$eval('#autocarlinks', (links) =>
        Array.from(links, (link) => {
          const items = link.querySelectorAll('td');
          // col.querySelector('textarea').value;

          const result = {
            name: items[1],
          };
          return result;
        })
      );
      // ? ••••••••••••••••••••••••••••••••••••••••••••••••••••••••• Below is res equaling data[i] •••••••••••••••••••••••••••••••••••••••••••••••••••••••••
      for (const i in data) {
        const res = data[i];

        if (!res.packId) continue;
        console.log(res);
        const query = { packId: res.packId };
        // const query = { name: "Deli Llama" };

        const update = { $set: res };
        const options = { upsert: true };
        try {
          const item = await db.collection('variants_kia').findOne(query);
          if (!item) {
            // send email here
            // ? ••••••••••••••••••••••••••••••••••••••••••••••••••••••••• Below is details of the email being sent •••••••••••••••••••••••••••••••••••••••••••••••••••••••••
            const mailOptions = {
              from: 'seansmodd@gmail.com',
              to: 'sean@senpex.com',
              subject: `you got new order ${res.title}`,
              text: `we have new order ${JSON.stringify(res)}`,
            };

            transporter.sendMail(mailOptions, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log('email sent');
              }
            });
          }
          db.collection('variants_kia').updateOne(query, update, options);
        } catch (ex) {}
      }
      // console.log(data);
      // resData.push(result);
      // get next page
      // console.log('log data', iteration);
      // console.log(resData);
      // console.log(`//a[text()='${iteration}']`);
      const [element] = await page.$x(`(//a[text()='${iteration}'])[1]`); // ? •••••••••••• What does this mean??? ••••••••••••
      // console.log(element);
      const next = await page.evaluateHandle(
        (e) => e.parentNode.nextSibling,
        element
      );
      await next.click();
      await page.waitForTimeout(2000);
      if (iteration > max) break;
      iteration++;
    }
    // resData = JSON.stringify(resData);
    // fs.writeFileSync('result.json', resData);
  })();
};
