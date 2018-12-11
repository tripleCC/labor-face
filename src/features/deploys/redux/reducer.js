import reduceReducers from 'reduce-reducers';
import { reducer as getDeployListReducer } from './getDeployList';
import { reducer as getDeployDetailReducer } from './getDeployDetail';
import { reducer as addDeployReducer } from './addDeploy';
import { reducer as deleteDeployReducer } from './deleteDeploy';
import { reducer as enqueueDeployReducer } from './enqueueDeploy';
import { reducer as manualPodDeployReducer } from './manualPodDeploy';
import { reducer as processDeployMessageReducer } from './processDeployMessage';
import { reducer as enqueuePodDeployReducer } from './enqueuePodDeploy';
import { reducer as cancelPodDeployReducer } from './cancelPodDeploy';
import { reducer as cancelDeployReducer } from './cancelDeploy';

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

  messageModule: null,
  messageId: null,
};

const reducer = reduceReducers(
  getDeployListReducer,
  getDeployDetailReducer,
  addDeployReducer,
  deleteDeployReducer,
  enqueueDeployReducer,
  manualPodDeployReducer,
  processDeployMessageReducer,
  enqueuePodDeployReducer,
  cancelPodDeployReducer,
  cancelDeployReducer,
);

export default reducer;
