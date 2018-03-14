export const stockSearchHasErrored = (msg) => {
    return {
        type: 'STOCK_SEARCH_HAS_ERRORED',
        error: msg
    };
};