import { combineReducers } from 'redux';
import getReducer from './getReducer';

const reducers = combineReducers({
  data: getReducer,
});

export default reducers;