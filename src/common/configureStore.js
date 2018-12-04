import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import history from './history';
import rootReducer, { initialState } from './rootReducer';

const store = createStore(
  rootReducer(history),
  initialState,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware,
      loggerMiddleware,
    ),
    // redux 调试工具
    window.devToolsExtension ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  ),
);

export default store;
