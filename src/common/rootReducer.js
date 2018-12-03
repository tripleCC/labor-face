import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import deploysReducer from '../features/deploys/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import userReducer from '../features/user/redux/reducer';

export const initialState = {
  deploys: {},
};

export default history =>
  combineReducers({
    router: connectRouter(history),
    deploys: deploysReducer,
    common: commonReducer,
    user: userReducer,
    // rest of your reducers
  });
