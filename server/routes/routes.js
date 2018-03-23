import stocks_controller from './controllers/stocks';

module.exports = function(app, io) {

    io.on('connection', (socket) => {
        socket.on('action', (action) => {
            switch(action.type) {
                case 'server/get-stocks':
                    stocks_controller.get_all_stocks_data(socket);
                    break;
                    
                case 'server/add-stock':
                    stocks_controller.add_stock(action.stockToAdd, socket);
                    break;
                    
                case 'server/delete-stock':
                    stocks_controller.delete_stock(action.stockToDelete, socket);
                    break;
                    
            }
            
        });
        
        socket.on('disconnect', () => {});
    });
    
    app.get('*', stocks_controller.render_data);
    
};