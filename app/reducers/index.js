import { combineReducers } from 'redux';
import { stocksHaveErrored, stocksAreLoading, search, stocks } from './stocks';

export default combineReducers({
   stocksAreLoading,
   stocksHaveErrored,
   search,
   stocks
});