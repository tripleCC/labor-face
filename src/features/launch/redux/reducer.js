import reduceReducers from 'reduce-reducers';
import {reducer as getLaunchInfosReducer} from './getLaunchInfos'
import {reducer as getDevicesReducer} from './getDevices'
export const initialState = {
  loading: false,
  error: null,
  infos: [],
  apps: [],
  devices: ['全部'],
  oss: ['全部'],
};
const reducer = reduceReducers(
  getLaunchInfosReducer,
  getDevicesReducer
);

export default reducer;
