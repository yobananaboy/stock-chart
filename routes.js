import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';

import configureStore from './app/store/configureStore';

import { stocksAreLoading } from './app/actions/stocks';

import { Provider } from 'react-redux';

import App from './app/component/App';

let store = configureStore();

module.exports = function(app, database, async, _, axios, stockAPIKey, io) {

    const Stocks = database.Stocks;
    
    const getAllStocksData = (socket, broadcast = false) => {
        console.log('getting all stocks');
        // search database for latest stock symbols searched
        Stocks.find({})
            .then(data => {
                console.log(data);
                // now have array of stock data from database
                
                // get todays date, clearing the hours
                let todaysDate = new Date();
                todaysDate = todaysDate.setHours(0, 0, 0, 0);
                // check to see if data is up to date - if the data was not last refreshed today then need to update data
                if(todaysDate !== data.lastRefresh) {
                    let stockPromises = [];
                    data.stocks.forEach((stock, index) => {
                        let stockSymbol = stock.symbol;
                        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${stockAPIKey}`;
                        stockPromises.push(axios.get(url));
                    });
                    // get all stock data with promise all
                    Promise.all(stockPromises)
                        .then(stockData => {
                            let stocks = [];
                            stockData.forEach(stock => {
                                // get symbol
                                let symbol = stock["Meta Data"]["2. Symbol"];
                                // loop through the time series, pulling date and closing price. Format date for highstock
                                let timeSeries = stock['Time Series (Daily)'];
                                
                                let seriesData = [];
                                Object.keys(timeSeries).forEach(key => {
                                    // parse date, which will be the key
                                    let date = Date.parse(new Date(key));
                                    // get closing price of stock
                                    let close = +timeSeries[key]["4. close"];
                                    // push array to stock data at its index
                                    seriesData.push([date, close]);
                                });
                                let newStock = new Stocks({
                                    symbol,
                                    data: seriesData,
                                    tooltip: {
                                        valueDecimals: 2
                                    }  
                                });
                                // push new stock to stocks object for emitting to users
                                stocks.push(newStock);
                            });
                            // emit to user
                            socket.emit('stocks-data', {stocks});
                            // and broadcast if true
                            broadcast ? socket.broadcast.emit('stocks-data', {stocks}) : void(0);
                            // save new array of stock data to db
                            data.stocks = stocks;
                            data.lastRefresh = todaysDate;
                            data.save()
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    
                } else {
                    socket.emit('stock-data', {stocks: data.stocks});
                }
                
                
            })
            .catch(err => {
                console.log(err);
                // send error message
            });
    };
    
    const addOneStock = (stockToAdd, socket) => {
        // search database for stock first, to see if it exists
        Stocks.find({})
            .then(stocks => {
                let search = _.findIndex(stocks, (stock) => {
                    return stock.symbol == stockToAdd;
                });
                // if search equal to minus one, stock not already in db
                if(search === -1) {
                    let stockSymbol = stockToAdd;
                    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${stockAPIKey}`;
                    axios.get(url)
                        .then(stock => {
                                let symbol = stock["Meta Data"]["2. Symbol"];
                                // loop through the time series, pulling date and closing price. Format date for highstock
                                let timeSeries = stock['Time Series (Daily)'];
                                
                                let seriesData = [];
                                Object.keys(timeSeries).forEach(key => {
                                    // parse date, which will be the key
                                    let date = Date.parse(new Date(key));
                                    // get closing price of stock
                                    let close = +timeSeries[key]["4. close"];
                                    // push array to stock data at its index
                                    seriesData.push([date, close]);
                                });
                                
                                let newStock = new Stocks({
                                    symbol,
                                    data: seriesData,
                                    tooltip: {
                                        valueDecimals: 2
                                    }
                                });
                                // emit new stock data to all users
                                socket.emit('stock-data', {stocks});
                                // then save stock to database
                                newStock.save()
                                    .catch(err => {
                                        console.log(err);
                                    });
                        })
                        .catch(err => {
                            console.log(err);
                            // emit error message
                        });
                    
                } else {
                    // else emit message for user
                }
            })
            .catch(err => {
                console.log(err);
                // handle error
            });
        
        
    };
    
    const deleteStock = (stockToDelete, socket) => {
        Stocks.find({})
            .then(stocks => {
                // filter stocks array to remove the stock to delete
                stocks.data = stocks.data.filter((s => {
                    return s.symbol === stockToDelete;
                }));
                stocks.save()
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    };

    io.on('connection', (socket) => {
        console.log('connected');
        // when client makes request for stocks, send stock data from API
        socket.on('stock-request', (socket) => getAllStocksData(socket));
        
        // when client adds new stock symbol to be displayed
        socket.on('new-stock-symbol', (stock, socket) => addOneStock(stock, socket));
        
        socket.on('delete-stock-symbol', (stock, socket) => deleteStock(stock, socket));
        
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