import React, { Component } from 'react';
import Body from '../container/Body';
import { Header } from './Header';
import { Footer } from './Footer';
import { connect } from 'react-redux';
import { socketConnect, newStockDataReceived, updateSearchIsLoading } from '../actions/stocks';
import { getStocks, sayHello } from '../actions/websocket';
import io from 'socket.io-client';

// const socket = io("https://stock-chart-server-render-mattkeegan20.c9users.io/");


// const socket = io.connect("https://matts-stock-chart.herokuapp.com/");


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
        hasErrored: state.stocksHaveErrored,
        isLoading: state.stocksAreLoading,
        searchIsLoading: state.searchIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        socketConnect: (socket) => dispatch(socketConnect(socket)),
        newStockDataReceived: (data) => dispatch(newStockDataReceived(data)),
        updateSearchIsLoading: (bool) => dispatch(updateSearchIsLoading(bool)),
        getStocks: () => dispatch(getStocks()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);