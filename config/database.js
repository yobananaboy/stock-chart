let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

require('dotenv').config();

let user = process.env.USERNAME;
let password = process.env.PASSWORD;
let host = process.env.HOST;
let port = process.env.DB_PORT;

let uri = `mongodb://${user}:${password}@${host}:${port}/stocks`;
mongoose.connect(uri, {useMongoClient: true});

let Schema = mongoose.Schema;
// create user schema in user collection
let stocksSchema = new Schema({
   _id: String,
   lastRefresh: Date,
   stocks: []
}, {collection: 'stocks-to-search'});

let Stocks = mongoose.model('Stocks', stocksSchema);

// export
module.exports = {
    Stocks
};