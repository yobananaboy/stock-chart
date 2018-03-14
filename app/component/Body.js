import React, { Component } from 'react';
import { StockChart } from '../component/StockChart';
import StockSymbols from '../component/StockSymbols';

export const Body = (props) => {
    
        let stockChart = <StockChart {...props} />;
        
        if(props.stocksAreLoading) stockChart = <div className="loader">Loading...</div>;
        
        if (props.stocksHaveErrored) stockChart = <p>There was an error loading data. Please try again.</p>;
        
        let stockSymbols;

        if(!props.stocksHaveErrored) {
            stockSymbols = (
                <div className="col-12 col-md-11 col-lg-10 stock-symbol-input-container">
                    <StockSymbols {...props} />
                </div>
                );
        }        
        
        return(
            <div className="row justify-content-center">
                <div className="col-12 col-md-11 col-lg-10 stock-chart-container">
                    {stockChart}
                </div>
                {stockSymbols}
            </div>
            );
            
};