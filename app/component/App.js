import React, { Component } from 'react';
import { Body } from './Body';
import { Header } from './Header';
import { Footer } from './Footer';
import { connect } from 'react-redux';
import { searchIsLoading, stockSearchHasErrored } from '../actions/stocks';
import { getStocks, addStock, deleteStock } from '../actions/websocket';
import io from 'socket.io-client';

class App extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.getStocks();
    }
    
    render() {
        return(
            <div className="container">
                <Header />
                <Body {...this.props} />
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        stocks: state.stocks,
        stocksHaveErrored: state.stocksHaveErrored,
        search: state.search
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStocks: () => dispatch(getStocks()),
        addStock: (stock) => dispatch(addStock(stock)),
        deleteStock: (stock) => dispatch(deleteStock(stock)),
        searchIsLoading: (bool) => dispatch(searchIsLoading(bool)),
        stockSearchHasErrored: (msg) => dispatch(stockSearchHasErrored(msg))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);