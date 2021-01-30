require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const Sheet = require('./odinproject/sheet');
try {
  (async () => {
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

    //! •••••••••••••••••••••••••••••••make sure here we are scraping correctly now
    await page.goto('https://senpex.com/index.php?module=clnt_packs&mid=37');
    const max = 10;
    var iteration = 1;
    var resData = [];

    while (true) {
      let data = await page.$$eval('#table-3 tr', (rows) => {
        return Array.from(rows, (row) => {
          const cols = row.querySelectorAll('td');
          return Array.from(cols, (col) => {
            if (col.querySelector('textarea')) {
              return ''; //col.querySelector('textarea').value;
            }
            return col.innerText.trim()
              ? col.innerText
              : 'sean-00000000---empty';
          });
        });
      });
      resData.push(data);
      console.log('log data', iteration);
      console.log(resData);
      // console.log(`//a[text()='${iteration}']`);
      const [element] = await page.$x(`(//a[text()='${iteration}'])[1]`);
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
    resData = JSON.stringify(resData);
    fs.appendFileSync('result.json', resData);
  })();
  //! ••••••••••••••••••••••••••••••• scraping here ends
} catch (error) {
  console.log('this is an error Sean');
}
console.log('Done before captcha Async');
//The file titled './captch_resolver.py' will create a new file titled './captcha.png'
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
console.log('Done After captcha Async');
