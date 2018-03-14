import React, { Component } from 'react';
import { StockChart } from '../component/StockChart';
import StockSymbols from '../component/StockSymbols';

export const Body = (props) => {
    
        let stockChart = props.stocks.length === 0 ? <div className="loader">Loading...</div> :  <StockChart {...props} />;
        if (props.stocksHaveErrored) stockChart = <p>There was an error loading data. Please try again.</p>;
        
        return(
            <div className="row justify-content-center">
                <div className="col-12 col-md-11 col-lg-10 stock-chart-container">
                    {stockChart}
                </div>
                <div className="col-12 col-md-11 col-lg-10 stock-symbol-input-container">
                    <StockSymbols {...props} />
                </div>
            </div>
            );
            
};