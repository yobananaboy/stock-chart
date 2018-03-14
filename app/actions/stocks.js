export const stocksAreLoading = (bool) => {
    return {
        type: 'STOCKS_ARE_LOADING',
        loading: bool
    };
};

export const stockSearchHasErrored = (msg) => {
    return {
        type: 'STOCK_SEARCH_HAS_ERRORED',
        error: msg
    };
};