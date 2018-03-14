export const searchIsLoading = (bool) => {
    return {
        type: 'STOCK_SEARCH_IS_LOADING',
        loading: bool
    };
};

export const stockSearchHasErrored = (msg) => {
    return {
        type: 'STOCK_SEARCH_HAS_ERRORED',
        error: msg
    };
};