import reduceReducers from 'reduce-reducers';
import { reducer as getDeployListReducer } from './getDeployList';
import { reducer as getDeployDetailReducer } from './getDeployDetail';

const reducer = reduceReducers(getDeployListReducer, getDeployDetailReducer);

export default reducer;
