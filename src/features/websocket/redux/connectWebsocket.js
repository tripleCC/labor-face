import {
  WEBSOCKET_ON_OPEN,
  WEBSOCKET_ON_CLOSE,
  WEBSOCKET_ON_MESSAGE,
} from './constants';

import { WEBSOCKET_HOST } from '../../../common/constants';

const initialState = {
  module: null,
  id: null,
  data: null,
  type: null,
  errorCode: null,
  errorReason: null,
  eventWasClean: null,
};

// Action
function connectWebsocket(dispatch, module, id) {
  const websocket = new WebSocket(`${WEBSOCKET_HOST}?module=${module}&id=${id}`);

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
    dispatch({
      type: WEBSOCKET_ON_MESSAGE,
      data: {
        module: module,
        id: id,
        data: json.data,
        type: json.type,
      },
    });
  };
  websocket.onclose = event => {
    dispatch({
      type: WEBSOCKET_ON_CLOSE,
      data: {
        module: module,
        id: id,
        errorCode: event.code,
        errorReason: event.reason,
        eventWasClean: event.wasClean,
      },
    });
  };

  return websocket;
}

// Reducer
function reducer(state = initialState, action) {
  const {data} = action;
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
        type: data.type,
        errorCode: null,
        errorReason: null,
        eventWasClean: null,
      };
    case WEBSOCKET_ON_CLOSE:
      return {
        ...state,
        module: data.module,
        id: data.id,
        errorCode: data.errorCode,
        errorReason: data.errorReason,
        eventWasClean: data.eventWasClean,
        // errorCode: action.
      };
    default:
      return state;
  }
}

export { connectWebsocket, reducer };
