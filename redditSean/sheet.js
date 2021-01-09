const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet(
      '19ltMHN30QH81UsFG_bqvBT8YHYN8fYQvfWy8oxg_BeM'
    );
  }

  async load() {
    await this.doc.useServiceAccountAuth(require('./credentials.json'));
    await this.doc.loadInfo();
  }
  //we will create a new sheet for every comment thread that we scrape!
  //make sure to add headerValues within the async addSheet(title!!!)
  async addSheet(title, headerValues) {
    await this.doc.addSheet({ title, headerValues });
    return this.doc.sheetsByIndex.length - 1;
  }
  async addRows(rows, i) {
    const sheet = this.doc.sheetsByIndex[i];
    await sheet.addRows(rows);
  }
  async getRows(i) {
    const sheet = this.doc.sheetsByIndex[i];
    const rows = await sheet.getRows();
    return rows;
  }
};
