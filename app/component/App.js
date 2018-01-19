import React, { Component } from 'react';
import Body from '../container/Body';
import { Header } from './Header';
import { Footer } from './Footer';
import { connect } from 'react-redux';
import { socketConnect, newStockDataReceived, updateSearchIsLoading } from '../actions/stocks';
import io from 'socket.io-client';

const socket = io.connect("https://matts-stock-chart.herokuapp.com/");

class App extends Component {
    constructor(props) {
        super(props);
        // whenever stock data is emitted, update stocks if there hasn't been an error
        socket.on('stock-data', data => {
            this.props.newStockDataReceived(data);
        });
    }
    
    componentDidMount() {
        this.props.updateSearchIsLoading(false);
        this.props.socketConnect(socket);
    }
    
    render() {
        return(
            <div className="container">
                <Header />
                <Body {...this.props} socket={socket} />
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
        updateSearchIsLoading: (bool) => dispatch(updateSearchIsLoading(bool))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);