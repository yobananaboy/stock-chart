import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';

import configureStore from './app/store/configureStore';

import { stocksAreLoading } from './app/actions/stocks';

import { Provider } from 'react-redux';

import App from './app/component/App';

let store = configureStore();

module.exports = function(app, database, async, _, rp, stockAPIKey, io) {

    const Stocks = database.Stocks;
    
    const getAllStocksData = (socket, broadcast) => {
            // search database for latest stock symbols searched
            Stocks.findOne({_id: 'stocks-info'}, (err, stocksDataOnDb) => {
                if(err) console.log(err);
                let stocksToSearch = stocksDataOnDb.stocksToSearch;
                // function for each stock symbol that we map
                const getStockData = (stockSymbol, done) => {
                    // for each stock symbol, create empty array which will be added to
                    let stockArr = [];
                    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${stockAPIKey}`;
                    // request data from stock api
                    rp(url)
                        .then(data => {
                            let jsonData = JSON.parse(data);
                            // loop through the time series, pulling date and closing price. Format date for highstock
                            let timeSeries = jsonData['Time Series (Daily)'];
                            Object.keys(timeSeries).forEach(key => {
                                // parse date, which will be the key
                                let date = Date.parse(new Date(key));
                                // get closing price of stock
                                let close = +timeSeries[key]["4. close"];
                                // push array to stock data at its index
                                stockArr.push([date, close]);
                            });
                            // reverse array so data is in chronological order
                            stockArr.reverse();
                            let seriesData = {
                                name: stockSymbol,
                                data: stockArr,
                                tooltip: {
                                    valueDecimals: 2
                                }
                            };                            
                            // return stock array when done
                            return done(null, seriesData);
                        })
                        .catch(err => {
                            if (err) {
                                console.log(err);
                                socket.emit('stock-data', {err: 'errorLoadingStocks'});
                            }
                        });
                }; 
                
                // async map through array of stock symbols from database, getting stock data
                async.map(stocksToSearch, getStockData, (err, stocksData) => {
                   if(err) {
                       console.log(err);
                       socket.emit('stock-data', {err: 'errorLoadingStocks'});
                   } else {
                       // if we have called this function because a stock has been updated in stock symbols, broadcast stock data for all
                       if(broadcast) {
                           socket.emit('stock-data', {stocksData: JSON.stringify(stocksData)});
                           socket.broadcast.emit('stock-data', {stocksData: JSON.stringify(stocksData)});
                       } else {
                            // else, user must have just connected - just emit to them
                            socket.emit('stock-data', {stocksData: JSON.stringify(stocksData)});      
                       }
                   }
                });
               
            });
            
        };
    
    
    
    io.on('connection', (socket) =>{
        console.log('connected');
        // when client makes request for stocks, send stock data from API
        socket.on('stock-request', () => {getAllStocksData(socket, false)});
        
        // when client adds new stock symbol to be displayed
        socket.on('new-stock-symbol', (data) => {
            // get the new stock symbol to be added, set to upper case for consistency
            let newStockSymbol = data.newStockSymbol.toUpperCase();
            // find stock info on database
           Stocks.findOne({_id: 'stocks-info'}, (err, stocksDataOnDb) => {
               if(err) console.log(err);
               // update database if stock symbol isn't already on database and if symbol reutrns data
               if(_.indexOf(stocksDataOnDb.stocksToSearch, newStockSymbol) === -1) {
                    // search for stock on API to make sure it exists, and save if so
                    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${newStockSymbol}&apikey=${stockAPIKey}`;
                    rp(url)
                        .then(data => {
                            if(_.indexOf(_.allKeys(JSON.parse(data)), 'Error Message') === -1) {
                                // update stock object on database with new stock symbol
                                stocksDataOnDb.stocksToSearch.push(newStockSymbol);
                                // save on database
                                stocksDataOnDb.save(err => {
                                    if(err) console.log(err);
                                    // get new data then broadcast to all users
                                    getAllStocksData(socket, true);
                                });  
                            } else {
                                getAllStocksData(socket, false);
                            }
                        })
                        .catch(err => {
                           console.log(err); 
                        });
               } else {
                   getAllStocksData(socket, false);
                   console.log('no need to update');
               }
            }); 
        });
        
        socket.on('delete-stock-symbol', (data) => {
            // get index of stock symbol to be deleted
            let index = +data.index;
            // find stock info on database
            Stocks.findOne({_id: 'stocks-info'}, (err, stocksDataOnDb) => {
               if(err) console.log(err);
               // splice array to remove item at index
               stocksDataOnDb.stocksToSearch.splice(index, 1);
               stocksDataOnDb.save(err => {
                   if(err) console.log(err);
                   // get new data then broadcast to all users
                   getAllStocksData(socket, true);
               });
            });
        });
        
        // when client disconnects
        socket.on('disconnect', () => {});
    });
    
    app.get('*', (req, res) => {
       let data = store.getState();
       store.dispatch(stocksAreLoading(true));
       const content = renderToString(
          <Provider store={store}>
            <App />
          </Provider>
        );
       res.render('index', {title: 'Express', data: JSON.stringify(data), content });
    });
    
};