const insertStock = (array, stock) => {
    let newArray = array.slice();
    newArray.push(stock);
    return newArray;
};

const deleteStock = (array, stock) => {
    return array.filter(s => {
        return s.symbol != stock;
    });
};

export const stocksAreLoading = (state = true, action) => {
    switch(action.type) {
        case 'STOCKS_ARE_LOADING':
            return action.loading;
            
        default:
            return state;
    }
};

export const stocksHaveErrored = (state = false, action) => {
    switch(action.type) {
        case 'ERROR_LOADING_ALL_STOCKS':
            return action.error;
            
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

export const search = (state = {}, action) => {
    switch(action.type) {
        case 'STOCK_SEARCH_IS_LOADING':
            return Object.assign({}, state, { loading: action.loading });
            
        case 'STOCK_SEARCH_HAS_ERRORED':
            return Object.assign({}, state, { error: action.error });
            
        default:
            return state;
    }
};