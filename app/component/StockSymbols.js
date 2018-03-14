import React, { Component } from 'react';
import emoji from 'react-easy-emoji'
import { getColor } from '../colors';

class StockSymbols extends Component  {
    
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

    render () {
        let stocks = this.props.stocks.map((stock, index) => {
            let color = getColor(index);
            return (
                <div className="col-12 col-md-4" key={index}>
                    <div className="card">
                        <div className="card-body" style={{'borderLeft': `${color} solid 5px`}}>
                            <h5>{stock.symbol}</h5>
                            <button className="btn btn-danger" onClick={this.props.onClick} id={index}>Remove</button>
                        </div>
                    </div>
                </div>
                );
        });
        let search = (
                    <form onSubmit={this.props.onSubmit}>
                        <div className="input-group search">
                            <input type="text" className="form-control" type="text" onChange={this.props.onChange} value={this.props.search} />
                            <span className="input-group-btn">
                                <button className="btn btn-dark" type="submit">{emoji(" 🔎 ")}</button>
                            </span>
                        </div>
                    </form>
                    );
        if(this.props.searchIsLoading) search = <p>Loading...</p>;
        
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