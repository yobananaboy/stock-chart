// connect function for when server side websocket connected with client
export const socketConnect = (socket) => {
    return (dispatch) => {
        // on connect emit stock request
        dispatch(stocksAreLoading(true));
        socket.emit('stock-request');
    };
};

export const newStockDataReceived = (data) => {
    return (dispatch) => {
        dispatch(stocksAreLoading(false));
        dispatch(updateSearchIsLoading(false));
        if(data.err === 'errorLoadingStocks') {
            dispatch(stocksHaveErrored(true, JSON.parse(data.err)));
        } else {
            dispatch(allStocksUpdated(JSON.parse(data.stocksData)));
        }
    };
};

export const addStock = (socket, stock) => {
    socket.emit('add-stock', {stock});
};

export const stockAdded = (stock) => {
    return {
        type: 'NEW_STOCK_ADDED',
        stock
    };
};

export const delteStock = (socket, stock) => {
    socket.emit('delete-stock', {stock});
};

export const stockDeleted = (name) => {
    return {
        type: 'STOCK_DELETED',
        name
    };
};

export const allStocksUpdated = (stocks) => {
    return {
        type: 'ALL_STOCKS_UPDATED',
        stocks
    };
};

export const stocksAreLoading = (bool) => {
    return {
        type: 'STOCKS_ARE_LOADING',
        isLoading: bool
    };
};

export const stocksHaveErrored = (bool) => {
    return {
        type: 'STOCKS_HAVE_ERRORED',
        hasErrored: bool
    };
};

export const updateSearchIsLoading = (bool) => {
    return {
        type: 'SEARCH_IS_LOADING',
        searchIsLoading: bool
    };
};