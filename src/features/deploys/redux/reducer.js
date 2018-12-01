import reduceReducers from 'reduce-reducers';
import { reducer as getDeployListReducer } from './getDeployList';
import { reducer as getDeployDetailReducer } from './getDeployDetail';
import { reducer as addDeployReducer } from './addDeploy';

const reducer = reduceReducers(
  getDeployListReducer,
  getDeployDetailReducer,
  addDeployReducer,
);

export default reducer;
