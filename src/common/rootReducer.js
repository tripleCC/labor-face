import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import deploysReducer from '../features/deploys/redux/reducer';

export const initialState = {
  deploys: {},
};

export default history =>
  combineReducers({
    router: connectRouter(history),
    deploys: deploysReducer,
    // rest of your reducers
  });
