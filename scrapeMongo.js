const mongoose = require('mongoose');

const scrapeMongo = mongoose.model(
  'scrapeMongo',
  mongoose.Schema({
    title: String
  })
);

module.exports = scrapeMongo;
