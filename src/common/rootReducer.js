import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import deploysReducer from '../features/deploys/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import userReducer from '../features/user/redux/reducer';
import websocketReducer from '../features/websocket/redux/reducer';

export default history =>
  combineReducers({
    router: connectRouter(history),
    deploys: deploysReducer,
    common: commonReducer,
    user: userReducer,
    websocket: websocketReducer,
    // rest of your reducers
  });
