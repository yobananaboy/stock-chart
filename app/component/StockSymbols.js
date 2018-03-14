import React, { Component } from 'react';
import emoji from 'react-easy-emoji'
import { getColor } from '../colors';

class StockSymbols extends Component  {
    
    constructor() {
        super();
        
        this.state = {
            stockSearch: ""
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteStock = this.deleteStock.bind(this);
        
    }
    
    componentDidMount() {
        this.props.stockSearchHasErrored(false);
    }
    
    handleChange(e) {
        e.preventDefault();
        this.setState({
            stockSearch: e.target.value
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        if(this.state.stockSearch.length > 1) {
            this.setState({
                stockSearch: ""
            });
            this.props.addStock(this.state.stockSearch);
        } else {
            this.props.stockSearchHasErrored('Please enter a stock to search.');
        }
    }
    
    deleteStock(e) {
        e.preventDefault();
        this.props.deleteStock('delete-stock-symbol', {index: +e.target.id});
    }

    render () {
        let stocks = this.props.stocks.map((stock, index) => {
            let color = getColor(index);
            return (
                <div className="col-12 col-md-4" key={index}>
                    <div className="card">
                        <div className="card-body" style={{'borderLeft': `${color} solid 5px`}}>
                            <h5>{stock.symbol}</h5>
                            <button className="btn btn-danger" onClick={this.deleteStock} id={stock.symbol}>Remove</button>
                        </div>
                    </div>
                </div>
                );
        });
        let search = (
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-group search">
                            <input type="text" className="form-control" type="text" onChange={this.handleChange} value={this.state.stockSearch} />
                            <span className="input-group-btn">
                                <button className="btn btn-dark" type="submit">{emoji(" 🔎 ")}</button>
                            </span>
                            <p className="error">{this.props.search.error}</p>
                        </div>
                    </form>
                    );
        if(this.props.search.loading) search = <p>Loading...</p>;
        
        return(
            <div className="row">
                <div className="col-12">
                    {search}
                </div>
                {stocks}
            </div>
            );
    }
}

export default StockSymbols;