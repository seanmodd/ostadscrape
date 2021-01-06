require('dotenv').config();
const { PythonShell } = require('python-shell');
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
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
  //   await browser.close();
})();

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
