import { combineReducers } from 'redux';
import { stocksHaveErrored, stocksAreLoading, search, stocks } from './stocks';

export default combineReducers({
   stocksHaveErrored,
   search,
   stocks
});