// import reduceReducers from 'reduce-reducers';
import {reducer as getCiStatusListReducer} from './getCiStatusList';
export const initialState = {
  loading: false,
  error: null,

  items: [],
  byId: {},
};

export default getCiStatusListReducer;
