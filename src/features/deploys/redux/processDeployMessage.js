import {
  DEPLOYS_WEBSOCKET_ON_OPEN,
  DEPLOYS_WEBSOCKET_ON_CLOSE,
  DEPLOYS_WEBSOCKET_ON_MESSAGE,
  DEPLOYS_WEBSOCKET_ON_ERROR,
  DEPLOYS_LABOR_DEPLOY_PROCESS_MODULE,
  DEPLOYS_LABOR_DEPLOY_PROCESS_MAIN_TYPE,
  DEPLOYS_LABOR_DEPLOY_PROCESS_POD_TYPE,
} from './constants';

import { WEBSOCKET_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function connectWebsocket(dispatch, id) {
  const module = DEPLOYS_LABOR_DEPLOY_PROCESS_MODULE;
  const websocket = new WebSocket(
    `${WEBSOCKET_HOST}?module=${module}&id=${id}`,
  );

  websocket.onopen = () => {
    dispatch({
      type: DEPLOYS_WEBSOCKET_ON_OPEN,
      data: {
        module: module,
        id: id,
      },
    });
  };

  websocket.onmessage = event => {
    const json = JSON.parse(event.data);
    dispatch({
      type: DEPLOYS_WEBSOCKET_ON_MESSAGE,
      data: {
        module: module,
        id: id,
        message: json.data,
        type: json.meta.type,
      },
    });
  };
  websocket.onclose = event => {
    dispatch({
      type: DEPLOYS_WEBSOCKET_ON_CLOSE,
      data: {
        module: module,
        id: id,
        error: event.reason,
        // {
        //   code: event.code,
        //   reason: event.reason,
        //   wasClean: event.wasClean,
        // },
      },
    });
  };
  websocket.onerror = event => {
    dispatch({
      type: DEPLOYS_WEBSOCKET_ON_ERROR,
      data: {
        module: module,
        id: id,
        error: event.reason,
      },
    });
  };

  return websocket;
}

// Reducer
function reducer(state = initialState, action) {
  const { data } = action;
  switch (action.type) {
    case DEPLOYS_WEBSOCKET_ON_OPEN:
      return {
        ...state,
        messageModule: data.module,
        messageId: data.id,
      };
    case DEPLOYS_WEBSOCKET_ON_MESSAGE:
      const { message } = data;
      const { detailById } = state;

      switch (data.type) {
        case DEPLOYS_LABOR_DEPLOY_PROCESS_MAIN_TYPE:
          return {
            ...state,
            detail: message,
          };
        case DEPLOYS_LABOR_DEPLOY_PROCESS_POD_TYPE:
          return {
            ...state,
            detailById: {...detailById, [message.id]: message}
          };
        default:
          return state;
      }
    case DEPLOYS_WEBSOCKET_ON_CLOSE:
      return {
        ...state,
        messageModule: data.module,
        messageId: data.id,
        error: data.error,
      };
    case DEPLOYS_WEBSOCKET_ON_ERROR:
      return {
        ...state,
        messageModule: data.module,
        messageId: data.id,
        error: data.error,
      };
    default:
      return state;
  }
}

export { connectWebsocket, reducer };
