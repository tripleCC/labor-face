// import reduceReducers from 'reduce-reducers';
import {reducer as getLaunchInfosReducer} from './getLaunchInfos'

export const initialState = {
  loading: false,
  error: null,
  infos: []
};
// const reducer = reduceReducers(
//   getDeployListReducer,
// );

export default getLaunchInfosReducer;
