import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { colors } from '../colors';

export const StockChart = (props) => {
  if (props.stocks.length === 0) {
    return <p>No data to load!</p>;
  }
  
  const config = {
      rangeSelector: {
        selected: 1
      },
      colors,
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
        valueDecimals: Number,
        split: false,
        shared: true
      },
      title: {
        text: 'Stocks'
      },
      series: props.stocks.map(stock => {
        return {
          name: stock.symbol,
          data: stock.data,
          tooltip: stock.tooltip
        };
      })
    };
  return(
        <ReactHighstock config={config} />
      );
};