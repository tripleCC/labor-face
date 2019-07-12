import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import deploysReducer from '../features/deploys/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import userReducer from '../features/user/redux/reducer';
import websocketReducer from '../features/websocket/redux/reducer';
import operationsReducer from '../features/operations/redux/reducer';
import ciReducer from '../features/ci/redux/reducer';
import launchReducer from '../features/launch/redux/reducer';
import leaksReducer from '../features/leaks/redux/reducer';

export default history =>
  combineReducers({
    router: connectRouter(history),
    deploys: deploysReducer,
    common: commonReducer,
    user: userReducer,
    websocket: websocketReducer,
    operations: operationsReducer,
    ci: ciReducer,
    launch: launchReducer,
    leaks: leaksReducer,
    // rest of your reducers
  });
