// connect function for when server side websocket connected with client
export const stocksAreLoading = (bool) => {
    return {
        type: 'STOCKS_ARE_LOADING',
        isLoading: bool
    };
};

export const stocksHaveErrored = (bool) => {
    return {
        type: 'ERROR_LOADING_ALL_STOCKS',
        hasErrored: bool
    };
};

export const updateSearchIsLoading = (bool) => {
    return {
        type: 'SEARCH_IS_LOADING',
        searchIsLoading: bool
    };
};