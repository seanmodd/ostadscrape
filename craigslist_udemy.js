const request = require('request-promise');
const cheerio = require('cheerio');

async function scrape() {
  for (let index = 0; index <= 360; index = index + 120) {
    const html = await request.get(
      'https://senpex.com/index.php?module=clnt_senders&mid=' + index
    );
    const $ = await cheerio.load(html);
    $('.c_list_item_3').each((index, element) => {
      console.log($(element).text());
    });
    console.log('At page number ' + index);
  }
}
scrape();