import { reducer as connectWebsocketReducer } from './connectWebsocket';

export const initialState = {
  module: null,
  id: null,
  data: {},
  meta: {},
  error: null,
};

export default connectWebsocketReducer;
