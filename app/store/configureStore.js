import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
const uri = 'https://stock-chart-server-render-mattkeegan20.c9users.io/';

let socket = io( uri );
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, socketIoMiddleware)
    );
}