// import reduceReducers from 'reduce-reducers';
import {reducer as getOperationListReducer} from './getOperationList'

export const initialState = {
  loading: false,
  error: null,

  items: [],
  page: 1,
  perPage: 3,
  total: 0,
  byId: {},
};
// const reducer = reduceReducers(
//   getDeployListReducer,
// );

export default getOperationListReducer;
