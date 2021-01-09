require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');

//1st async function
//Using Puppeteer to launch chromium browser!
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://senpex.com/admin.php');
  await page.type('#txtLogin', process.env.USERNAME);
  await page.type('#txtPass', process.env.PASSWORD);

  //Still 1st async function continued...
  //Locating the captcha within the HTML...
  const element = await page.$('img[src="lib/captcha.php?id=loginpage"]');
  const rect = await page.evaluate((ele) => {
    const { top, left, bottom, right } = ele.getBoundingClientRect();
    return { top, left, bottom, right };
  }, element);

  //Still 1st async function continued...
  //Taking screenshot of captcha to interpret it
  await page.screenshot({
    path: 'captcha.png',
    clip: {
      x: rect.left,
      y: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
    },
  });

  //Still 1st async function continued...
  //The Await Promise function to set in place the callback to solve Captcha...
  //Ask Omid why this 'await solve('captcha.png') is allowed to turn into the 2nd async function below, the one with 'async function solve(captcha)'... how is this even possible? it's confusing... and there seems to be nested Promises? Isn't this just callback hell?
  const res = await solve('captcha.png');
  await page.type('#txtCaptcha', res);

  await page.click('#btnLogin');
  //   await browser.close();
  /*
THIS IS WHERE YOU CLICK ON THE MENU BUTTON AND THEN THE SENDERS BUTTON AND START SCRAPING
  */

  //Show this to Omid... why isn't it working??
  // async () => {
  //   const menuBtn = await page.$x('/html/body/div[1]/div/a');
  //   menuBtn.click();
  //   const sendersBtn = await page.$x(
  //     '/html/body/div[3]/div[1]/div/ul/li[4]/ul/li[3]/a'
  //   );
  //   sendersBtn.click();
  // };
  // const newurl = 'https://senpex.com/index.php?module=clnt_senders&mid=32';
  //Here is another attempt:
  // async function run() {
  //     const browser = await puppeteer.launch({
  //     headless: false,
  //   });
  //   const page = await browser.newPage();
  //   const menuBtn = await page.$x('/html/body/div[1]/div/a');
  //   menuBtn.click();
  // }
})();

//2nd async function
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

