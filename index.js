require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
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
  'mongodb+srv://seanmodd:2thepack@senpexcluster.dn1ks.mongodb.net/senpex?retryWrites=true&w=majority';
// 'mongodb+srv://seanmodd:2thepack@scrapercluster.dn1ks.mongodb.net/mongosenpexretryWrites=true&w=majority';

// Database Name
const dbName = 'senpex';

// Use connect method to connect to the server
MongoClient.connect(url, async function (err, client) {
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  await doScrape(db);
});

let doScrape = async (db) => {
  await (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto('https://senpex.com/admin.php');
    await page.type('#txtLogin', process.env.USERNAME);
    await page.type('#txtPass', process.env.PASSWORD);
    const element = await page.$('img[src="lib/captcha.php?id=loginpage"]');
    const rect = await page.evaluate((ele) => {
      const { top, left, bottom, right } = ele.getBoundingClientRect();
      return { top, left, bottom, right };
    }, element);
    await page.screenshot({
      path: 'captcha.png',
      clip: {
        x: rect.left,
        y: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top,
      },
    });
    const res = await solve('captcha.png');
    await page.type('#txtCaptcha', res);
    await page.click('#btnLogin');
    //! ••••••••••••••••••••••••••••••••••• Below is where the scraping starts!! •••••••••••••••••••••••••••••••••••••••••
    await page.goto('https://senpex.com/index.php?module=clnt_packs&mid=37');
    const max = 1;
    var iteration = 1;
    var resData = [];
    //? ••••••••••••••••••• Below is very CONFUSING... ask Omid! •••••••••••••••••••
    while (true) {
      let data = await page.$$eval('#table-3 tr', (rows) => {
        return Array.from(rows, (row) => {
          var cols = row.querySelectorAll('td');

          cols = Array.from(cols, (col) => {
            if (col.querySelector('textarea')) {
              return ''; //col.querySelector('textarea').value; //? •••••••••• What is going on in this while loop??? ••••••••••
            }
            return col.innerText.trim()
              ? col.innerText
              : 'sean-00000000---empty';
          });

          var result = {
            packId: cols[1],
            type: cols[2],
            title: cols[3],
            pickupTime: cols[4],
            pickupAddress: cols[5],
            deliveryAddress: cols[6],
            ownerName: cols[7],
            courierName: cols[8],
            packagePrice: cols[9],
            packageStatus: cols[10],
          };
          return result;
        });
      });
 //? ••••••••••••••••••••••••••••••••••••••••••••••••••••••••• Below is res equaling data[i] •••••••••••••••••••••••••••••••••••••••••••••••••••••••••
      for (var i in data) {
        let res = data[i];

        if (!res.packId) continue;
        console.log(res);
        const query = { packId: res.packId };
        // const query = { name: "Deli Llama" };

        const update = { $set: res };
        const options = { upsert: true };
        try {
          let item = await db.collection('orderspanel').findOne(query);
          if (!item) {
            //send email here
//? ••••••••••••••••••••••••••••••••••••••••••••••••••••••••• Below is details of the email being sent •••••••••••••••••••••••••••••••••••••••••••••••••••••••••
            var mailOptions = {
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
          db.collection('orderspanel').updateOne(query, update, options);
        } catch (ex) {}
      }
      // console.log(data);
      // resData.push(result);
      //get next page
      // console.log('log data', iteration);
      // console.log(resData);
      // console.log(`//a[text()='${iteration}']`);
      const [element] = await page.$x(`(//a[text()='${iteration}'])[1]`); //? •••••••••••• What does this mean??? ••••••••••••
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
//! ••••••••••••••••••••••••••••••••••• Above is where the scraping ends!! •••••••••••••••••••••••••••••••••••••••••
async function solve(captcha) {
  return new Promise((resolve, reject) => {
    var scriptPath = path.join(__dirname, './captcha_resolver.py');
    let options = {
      pythonPath: '/Users/seanmodd/opt/anaconda3/bin/python',
      args: [captcha],
    };
    PythonShell.run(scriptPath, options, function (err, results) {
      if (err) {
        // fs.writeFileSync("omid-omid.html", data);
        console.log(err);
      }
      if (err) reject('erorooooor');
      else resolve(results[0]);
    });
  });
}
