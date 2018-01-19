// actions

// connect function for when server side websocket connected with client
export const socketConnect = (socket) => {
    return (dispatch) => {
        // on connect emit stock request
        socket.on('connect', () => {
          dispatch(stocksAreLoading(true));
          socket.emit('stock-request');
        });
        

    };
};

export const newStockDataReceived = (data) => {
    return (dispatch) => {
        dispatch(stocksAreLoading(false));
        dispatch(updateSearchIsLoading(false));
        if(data.err === 'errorLoadingStocks') {
            dispatch(stocksHaveErrored(true, JSON.parse(data.err)));
        } else {
            dispatch(stocksUpdated(JSON.parse(data.stocksData)));
        }
    };
};


export const stocksUpdated = (stocksData) => {
    return {
        type: 'STOCKS_UPDATED',
        stocksData
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