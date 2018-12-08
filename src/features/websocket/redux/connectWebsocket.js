import {
  WEBSOCKET_ON_OPEN,
  WEBSOCKET_ON_CLOSE,
  WEBSOCKET_ON_MESSAGE,
  WEBSOCKET_ON_ERROR,
} from './constants';

import { WEBSOCKET_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function connectWebsocket(dispatch, module, id) {
  const websocket = new WebSocket(
    `${WEBSOCKET_HOST}?module=${module}&id=${id}`,
  );

  websocket.onopen = () => {
    dispatch({
      type: WEBSOCKET_ON_OPEN,
      data: {
        module: module,
        id: id,
      },
    });
  };

  websocket.onmessage = event => {
    const json = JSON.parse(event.data);
    console.log(json);
    dispatch({
      type: WEBSOCKET_ON_MESSAGE,
      data: {
        module: module,
        id: id,
        data: json.data,
        type: json.meta.type,
      },
    });
  };
  websocket.onclose = event => {
    dispatch({
      type: WEBSOCKET_ON_CLOSE,
      data: {
        module: module,
        id: id,
        error: {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        },
      },
    });
  };
  websocket.onerror = event => {
    dispatch({
      type: WEBSOCKET_ON_ERROR,
      data: {
        module: module,
        id: id,
        error: {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        },
      },
    });
  };

  return websocket;
}

// Reducer
function reducer(state = initialState, action) {
  const { data } = action;
  switch (action.type) {
    case WEBSOCKET_ON_OPEN:
      return {
        ...state,
        module: data.module,
        id: data.id,
      };
    case WEBSOCKET_ON_MESSAGE:
      return {
        ...state,
        module: data.module,
        id: data.id,
        data: data.data,
        meta: data.meta,
        error: null,
      };
    case WEBSOCKET_ON_CLOSE:
      return {
        ...state,
        module: data.module,
        id: data.id,
        error: data.error,
      };
    case WEBSOCKET_ON_ERROR:
      return {
        ...state,
        module: data.module,
        id: data.id,
        error: data.error,
      };
    default:
      return state;
  }
}

export { connectWebsocket, reducer };
