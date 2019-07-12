// import reduceReducers from 'reduce-reducers';
import {reducer as getLeakInfosReducer} from './getLeakInfos'
export const initialState = {
  loading: false,
  error: null,
};
// const reducer = reduceReducers(
//   getLaunchInfosReducer,
//   getDevicesReducer
// );

export default getLeakInfosReducer;
