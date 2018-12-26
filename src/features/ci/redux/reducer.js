// import reduceReducers from 'reduce-reducers';
import { reducer as getCiStatusListReducer } from './getCiStatusList';
export const initialState = {
  loading: false,
  error: null,

  items: [],
  page: 1,
  perPage: 10,
  total: 0,
  byId: {},

  owners: ['全部'],
  teams: ['全部'],
};

export default getCiStatusListReducer;
