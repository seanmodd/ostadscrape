//The following is from the YouTube video: https://www.youtube.com/watch?v=1d1YSYzuRzU
require('dotenv').config();
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url =
  'https://www.amazon.com/Sony-Noise-Cancelling-Headphones-WH1000XM3/dp/B07G4MNFS1';

async function configureBrowser() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function checkprice(page) {
  await page.reload();
  let html = await page.evaluate(() => document.body.innerHTML);
  // console.log(html);
  $('#priceblock_ourprice', html).each(function () {
    let dollarPrice = $(this).text();
    console.log(dollarPrice);
  });
}

async function monitor() {
  let page = await configureBrowser();
  await checkprice(page);
}
monitor();
