const mongoose = require('mongoose');
require('dotenv').config();

const user = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const port = process.env.DB_PORT;


const uri = `mongodb://${user}:${password}@${host}:${port}/stocks`;
mongoose.connect(uri, {useMongoClient: true});

const Schema = mongoose.Schema;
// create user schema in user collection
const stocksSchema = new Schema({
   _id: String,
   stocksToSearch: []
}, {collection: 'stocks-to-search'});

const Stocks = mongoose.model('Stocks', stocksSchema);

// export
module.exports = {
    Stocks
};