import { combineReducers } from 'redux';
import { stocksHaveErrored, stocksAreLoading, searchIsLoading, stocks } from './stocks';

export default combineReducers({
   stocksHaveErrored,
   stocksAreLoading,
   searchIsLoading,
   stocks
});