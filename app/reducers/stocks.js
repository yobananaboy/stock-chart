import _ from 'underscore';

const insertStock = (array, stock) => {
    let newArray = array.slice();
    newArray.push(stock);
    return newArray;
}

const deleteStock = (array, stock) => {
    let stockName = stock.symbol;
    let filteredArray = array.filter(s => {
        s.symbol !== stockName;
    });
    return filteredArray;
}

export const stocksHaveErrored = (state = false, action) => {
    switch(action.type) {
        case 'ERROR_LOADING_ALL_STOCKS':
            return action.hasErrored;
            
        default:
            return state;
    }
};

export const stocksAreLoading = (state = false, action) => {
    switch(action.type) {
        case 'STOCKS_ARE_LOADING':
            return action.isLoading;
            
        default:
            return state;
    }  
};

export const stocks = (state = [], action) => {
    switch(action.type) {
        case 'ALL_STOCKS_DATA':
            return action.stocks;

        case 'NEW_STOCK_ADDED':
            return insertStock(state, action.stock);
            
        case 'STOCK_DELETED':
            return deleteStock(state, action.stock);
            
        default:
            return state;
    }
};

export const searchIsLoading = (state = false, action) => {
    switch(action.type) {
        case 'SEARCH_IS_LOADING':
            return action.searchIsLoading;
            
        default:
            return state;
    }
};