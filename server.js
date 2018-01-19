require('babel-register')({
    presets: ["env", "react", "stage-2", "es2015"],
    plugins: ["transform-class-properties"]
});

const http = require('http');
const path = require('path');
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./config/database');
const async = require('async');
const _ = require('underscore');
const rp = require('request-promise');

const stockAPIKey = process.env.ALPHAVANTAGE_KEY;

const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use('/public', express.static('public'));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'ejs');

require('./routes')(app, database, async, _, rp, stockAPIKey, io);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
