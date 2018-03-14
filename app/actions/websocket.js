export const getStocks = () => {
    return {  type: 'server/get-stocks' };
};

export const addStock = (stock) => {
    return { type: 'server/add-stock', stockToAdd: stock };
};

export const deleteStock = (stock) => {
    return { type: 'server/add-stock', stockToDelete: stock };
};