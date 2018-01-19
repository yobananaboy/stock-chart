export const stocksHaveErrored = (state = false, action) => {
    switch(action.type) {
        case 'STOCKS_HAVE_ERRORED':
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
        case 'STOCKS_UPDATED':
            return action.stocksData;
            
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