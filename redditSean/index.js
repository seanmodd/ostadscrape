const puppeteer = require('puppeteer');
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

  //   //takes a screenshot and saves it in the local directory
  //   await page.screenshot({ path: 'example.png' });
  //expand all comment threads... the 'page.$' await is the same as 'document.querySelector('.morecomments')' and 'page.$$' is the same as 'document.querySelectorAll('.morecomments')' the '.morecomments' is an example of a class name...
  const expandButtons = await page.$$('.morecomments');
  //   console.log(expandButtons.length);
  //select all comments, scrape text and points
  //click on the button is what we do below...
  for (let button of expandButtons) {
    await button.click();
    await page.waitFor(500);
  }

  //sort comments by points

  //insert into google spreadsheets
})();
