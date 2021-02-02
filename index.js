require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
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
  await page.goto('https://senpex.com/index.php?module=clnt_packs&mid=37');
  const max = 1;
  var iteration = 1;
  var resData = [];
  //? Below is very CONFUSING... ask Omid!
  while (true) {
    let data = await page.$$eval('#table-3 tr', (rows) => {
      return Array.from(rows, (row) => {
        const cols = row.querySelectorAll('td');
        return Array.from(cols, (col) => {
          if (col.querySelector('textarea')) {
            return ''; //col.querySelector('textarea').value; //? What is going on in this while loop???
          }
          return col.innerText.trim() ? col.innerText : 'sean-00000000---empty';
        });
      });
    });
    resData.push(data);
    //get next page
    console.log('log data', iteration);
    console.log(resData);
    // console.log(`//a[text()='${iteration}']`);
    const [element] = await page.$x(`(//a[text()='${iteration}'])[1]`); //? What does this mean???
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
  fs.writeFileSync('result.json', resData);
})();
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
