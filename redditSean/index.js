const puppeteer = require('puppeteer');
const Sheet = require('./sheet');
const url =
  'https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvards_free_online_2016_cs50/';

(async function () {
  //first line starts the chrome headless browser until you add the option of {headless: false} within launch!
  const browser = await puppeteer.launch({ headless: false });
  //now you create a new page or new tab
  const page = await browser.newPage();
  //consider console logging out the page page variable and the browser variable to see what it picks up... run console.log({page})
  //then you navigate to that page and enter the url
  await page.goto(url);
  //new sheet, instantiate it
  const sheet = new Sheet();
  await sheet.load();
  //here we take the title and eval it
  //remember to add await before page.$eval... the tutorial didn't show him doing this and this caused him to get a google API error...
  const title = await page.$eval('.title a', (el) => el.textContent);
  //you have to always make sure the title name is under 100 characters!!!
  //add header values after the title slice!
  const sheetIndex = await sheet.addSheet(title.slice(0, 99), ['points', 'text']);

  //   //takes a screenshot and saves it in the local directory
  //   await page.screenshot({ path: 'example.png' });

  //expand all comment threads... the 'page.$' await is the same as 'document.querySelector('.morecomments')' and 'page.$$' is the same as 'document.querySelectorAll('.morecomments')' the '.morecomments' is an example of a class name...
  let expandButtons = await page.$$('.morecomments');
  //it's not picking up the last more comments, make sure to do that with the while comments
  while (expandButtons.length) {
    //select all comments, scrape text and points
    //click on the button is what we do below...
    for (let button of expandButtons) {
      await button.click();
      await page.waitFor(500);
    }
    await page.waitFor(1000);
    expandButtons = await page.$$('.morecomments');
  }
  //   console.log(expandButtons.length);
  //below we are getting ready to query select all of the comments which have the class 'entry'
  const comments = await page.$$('.entry');
  const formattedComments = [];
  //we want the child of each comment...
  for (let comment of comments) {
    //scrape points
    //scrape text
    const points = await comment
      .$eval('.score', (el) => el.textContent)
      .catch((err) => console.error('no score'));

    const rawText = await comment
      .$eval('.usertext-body', (el) => el.textContent)
      .catch((err) => console.error('no text'));
    //fills the formatted array...
    if (points && rawText) {
      const text = rawText.replace(/\n/g, '');
      formattedComments.push({ points, text });
    }
  }

  //sort comments by points
  formattedComments.sort((a, b) => {
    const pointsA = Number(a.points.split(' ')[0]);
    const pointsB = Number(b.points.split(' ')[0]);
    return pointsB - pointsA;
  });
  console.log({ formattedComments });

  //insert into google spreadsheets
  sheet.addRows(formattedComments, sheetIndex);

  await browser.close();
  //we will create a new sheet for every comment thread that we scrape!
})();
