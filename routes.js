import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';

import configureStore from './app/store/configureStore';

import { stocksAreLoading } from './app/actions/stocks';

import { Provider } from 'react-redux';

import App from './app/component/App';

let store = configureStore();

module.exports = function(app, database, async, _, axios, stockAPIKey, io) {

    const Stocks = database.Stocks;
    
    const getDateWithoutTime = (date) => {
        return new Date(date.setHours(0, 0, 0, 0));
    };
    
    const addStockToDb = (stock) => {

        let symbol = stock["Meta Data"]["2. Symbol"];
        let timeSeries = stock['Time Series (Daily)'];
        let lastRefresh = stock["Meta Data"]["3. Last Refreshed"];
        let seriesData = [];
                        
        Object.keys(timeSeries).forEach(key => {
            // parse date, which will be the key
            let date = Date.parse(new Date(key));
            // get closing price of stock
            let close = +timeSeries[key]["4. close"];
            // push array to stock data at its index
            seriesData.push([date, close]);
        });
        
        let stockForDb = {
            _id: symbol,
            symbol,
            lastRefresh,
            data: seriesData.reverse(),
            tooltip: {
                valueDecimals: 2
            }
        };
        // upsert stock on database to create new or update existing
        Stocks.update({_id: symbol}, stockForDb, { upsert: true }).exec()
            .catch(err => console.log(err));
        
        return stockForDb;
    };
    
    const getAllStocksData = (socket, broadcast = false) => {
        
            // search database for latest stock symbols searched
            Stocks.find({}).then(data => {
                
                // create empty array to hold promises
                let stockPromises = [];
                
                // get todays date, clearing the hours
                let todaysDate = getDateWithoutTime(new Date());
                
                stockPromises = data.map(stock => {
                    // if stock was not last refreshed today, push promise to array of promises
                    if (todaysDate != stock.lastRefresh) {
                        let stockSymbol = stock.symbol;
                        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${stockAPIKey}`;
                        return axios.get(url, { timeout: 3000 });
                    }
                    // else data is up to date - push data to array of promises to be resolved immediately
                    else {
                        return stock;
                    }
                });
                Promise.all(stockPromises)
                    .then(stockData => {
                        let stocks = stockData.map(stock => {
                            
                            // if we get meta data from alpha vantage then this is new data we need to coerce and then save to db
                            if ("Meta Data" in stock.data) {
                                stock = stock.data;
                                let symbol = stock["Meta Data"]["2. Symbol"];
                                let timeSeries = stock['Time Series (Daily)'];
                                let lastRefresh = stock["Meta Data"]["3. Last Refreshed"];
                                let seriesData = [];
                        
                                Object.keys(timeSeries).forEach(key => {
                                    // parse date, which will be the key
                                    let date = Date.parse(new Date(key));
                                    // get closing price of stock
                                    let close = +timeSeries[key]["4. close"];
                                    // push array to stock data at its index
                                    seriesData.push([date, close]);
                                });
                                
                                let stockForDb = {
                                    _id: symbol,
                                    symbol,
                                    lastRefresh,
                                    data: seriesData.reverse(),
                                    tooltip: {
                                        valueDecimals: 2
                                    }
                                };
                                // upsert stock on database to create new or update existing
                                Stocks.update({_id: symbol}, stockForDb, { upsert: true }).exec()
                                    .catch(err => console.log(err));
                                
                                return stockForDb;

                            }
                            // else data must be from database, so just return it
                            else {

                                return stock;
                            }
                        });
                        // emit to user
                        socket.emit('action', { type: 'ALL_STOCKS_DATA', stocks: stocks });
                        // and broadcast if true
                        broadcast ? socket.broadcast.emit('action', { type: 'ALL_STOCKS_DATA', stocks: stocks }) : void(0);
                    }).catch(err => console.log(err));
            })
            .catch(err => {
                console.log(err);
            });
    };
    
    const addStock = (stockToAdd, socket) => {
        // search database for stock first, to see if it exists
        Stocks.find({})
            .then(stocks => {
                let search = _.findIndex(stocks, stock => {
                    return stock.symbol == stockToAdd;
                });
                // if search equal to minus one, stock not already in db
                if(search === -1) {
                    let stockSymbol = stockToAdd;
                    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${stockAPIKey}`;
                    axios.get(url)
                        .then(stock => {
                            let stockAdded = addStockToDb(stock.data);
                            
                            // emit new stock data to all users
                            socket.emit('action', { type: 'NEW_STOCK_ADDED', stock: stockAdded });
                            socket.broadcast.emit('action', { type: 'NEW_STOCK_ADDED', stock: stockAdded });
          
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
        Stocks.remove({_id: stockToDelete}).exec()
            .catch(err => console.log(err));
    };

    io.on('connection', (socket) => {
        console.log('connected');
        socket.on('action', (action) => {
            switch(action.type) {
                case 'server/get-stocks':
                    getAllStocksData(socket);
                    break;
                    
                case 'server/add-stock':
                    addStock(action.stockToAdd, socket);
                    break;
                    
                case 'server/delete-stock':
                    deleteStock(action.stockToDelete, socket);
                    break;
                    
            }
            
        });
        
        
        /*
        // when client makes request for stocks, send stock data from API
        socket.on('STOCK-REQUEST', (socket) => getAllStocksData(socket));
        
        // when client adds new stock symbol to be displayed
        socket.on('NEW-STOCK-SYMBOL', (stock, socket) => addOneStock(stock, socket));
        
        socket.on('DELETE-STOCK-SYMBOL', (stock, socket) => deleteStock(stock, socket));
        */
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