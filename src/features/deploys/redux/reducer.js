import reduceReducers from 'reduce-reducers';
import { reducer as getDeployListReducer } from './getDeployList';
import { reducer as getDeployDetailReducer } from './getDeployDetail';
import { reducer as addDeployReducer } from './addDeploy';
import { reducer as deleteDeployReducer } from './deleteDeploy';

export const initialState = {
  loading: false,
  error: null,

  items: [],
  page: 1,
  perPage: 3,
  total: 0,
  byId: {},

  detail: {},
  detailItems: [],
  detailById: {},
};

const reducer = reduceReducers(
  getDeployListReducer,
  getDeployDetailReducer,
  addDeployReducer,
  deleteDeployReducer,
);

export default reducer;
