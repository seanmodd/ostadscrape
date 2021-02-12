require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { exit } = require('process');

// Connection URL
const url =
  'mongodb+srv://seanmodd:2thepack@senpexcluster.dn1ks.mongodb.net/senpex?retryWrites=true&w=majority';
// 'mongodb+srv://seanmodd:2thepack@scrapercluster.dn1ks.mongodb.net/mongosenpexretryWrites=true&w=majority';

// Database Name
const dbName = 'newdb';

// Use connect method to connect to the server
MongoClient.connect(url, async function (err, client) {
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  await doScrape(db);
});

let doScrape = async (db) => {
  await (async () => {
    const browser = await puppeteer.launch({
      headless: false,
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
    // await page.goto('https://senpex.com/index.php?module=clnt_packs&mid=37');
    await page.goto(
      'https://senpex.com/index.php?module=clnt_view_pack&id=55426'
    );
    // const min = 550;
    // var iteration = 1;
    // var resData = [];
    //? Sending Name
    var eee = await page.$x('//*[@id="t_gen_info"]/div[1]/div[1]/span/input');
    var text = await page.evaluate((element) => element.value, eee[0]);
    console.log('sendingName', text);
    //? Entered Sender Info
    eee = await page.$x('//*[@id="t_gen_info"]/div[1]/div[2]/span/input');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('senderName', text);
    //? Package Type
    eee = await page.$x('//*[@id="t_gen_info"]/div[2]/div[1]/span/input');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageType', text);
    //? Package Transport
    eee = await page.$x('//*[@id="t_gen_info"]/div[2]/div[2]/span/input');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageTransport', text);
    //? Package Size
    eee = await page.$x('//*[@id="t_gen_info"]/div[2]/div[3]/span/input');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageSize', text);
    //? Package Weight
    eee = await page.$x('//*[@id="txtPackWeight"]');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageWeight', text);
    //? Item Value
    eee = await page.$x('//*[@id="txtItemValue"]');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('itemValue', text);
    //? Description Text
    eee = await page.$x('//*[@id="drpDescText"]');
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('descriptionText', text);
    //? Receiver Name
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[5]/div[1]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('receiverName', text);
    //? Receiver Cell
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[5]/div[2]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('receiverCell', text);
    //? Package From:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[6]/div[1]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageFrom', text);
    //? Package To:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[6]/div[2]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageTo', text);
    //? Distance:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[7]/div[1]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('distance', text);
    //? Distance Time:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[7]/div[2]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('distanceTime', text);
    //? Taken Urgent:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[7]/div[3]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('takenUrgent', text);
    //? Taken Time:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[7]/div[4]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('takenTime', text);
    //? Package Price:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[1]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packagePrice', text);
    //? Price with Insurance:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[2]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('priceWithInsurance', text);
    //? Price without Insurance:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[3]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('priceBeforeInsurance', text);
    //? Insurance Price:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[4]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('insurancePrice', text);
    //? Insurance Price:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[5]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('insurancePrice', text);
    //? Refund Amount:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[6]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('refundAmount', text);
    //? Is Insurance Paid:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[8]/div[7]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('isInsurancePaid', text);
    //? Courier Profit:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[9]/div[1]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('courierProfit', text);
    //? Senpex Profit:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[9]/div[2]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('senpexProfit', text);
    //? Bank Fee:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[9]/div[3]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packageSize', text);
    //? Stripe Payout Fee:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[9]/div[4]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('stripePayoutFee', text);
    //? Tax Fee:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[9]/div[5]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('taxFee', text);
    //? Package Paid:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[9]/div[6]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packagePaid', text);
    //? Courier Paid:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[10]/div[1]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('courierPaid', text);
    //? Courier Name:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[10]/div[2]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('courierName', text);
    //? Sender Paid Real:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[10]/div[3]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('senderPaidReal', text);
    //? Insurance Mode:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[10]/div[4]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('insuranceMode', text);
    //? Pack Status:
    eee = await page.$x(
      '/html/body/div[3]/div[2]/div[1]/form/div/div[2]/div[10]/div[5]/div/input'
    );
    text = await page.evaluate((element) => element.value, eee[0]);
    console.log('packStatus', text);

    let data = await page.$$eval('.just_text', (forms) => {
      return forms.map((form) => form.textContent);
    });
    // console.log(data);
    // if (iteration < min) break;
    // iteration--;
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
