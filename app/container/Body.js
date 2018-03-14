import React, { Component } from 'react';
import { StockChart } from '../component/StockChart';
import { StockSymbols } from '../component/StockSymbols';

class Body extends Component {
    constructor() {
        super();
        this.state = {
            search: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleChange(e) {
        e.preventDefault();
        this.setState({
            search: e.target.value
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        if(this.state.search.length > 1) {
            this.props.updateSearchIsLoading(true);
            this.props.socket.emit('new-stock-symbol', {newStockSymbol: this.state.search});    
        }
        this.setState({
            search: ""
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        this.props.updateSearchIsLoading(true);
        this.props.socket.emit('delete-stock-symbol', {index: +e.target.id});
    }
    
    render() {
        let stockChart = this.props.stocks.length === 0 ? <div className="loader">Loading...</div> :  <StockChart {...this.props} />;
        if (this.props.stocksHaveErrored) stockChart = <p>There was an error loading data. Please try again.</p>;
        
        return(
            <div className="row justify-content-center">
                <div className="col-12 col-md-11 col-lg-10 stock-chart-container">
                    {stockChart}
                </div>
                <div className="col-12 col-md-11 col-lg-10 stock-symbol-input-container">
                    <StockSymbols {...this.props} search={this.state.search} onChange={this.handleChange} onSubmit={this.handleSubmit} onClick={this.handleClick} />
                </div>
            </div>
            );
    }
}

export default Body;