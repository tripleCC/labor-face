import axios from 'axios';
import {
  MONITOR_LAUNCH_GET_LAUNCH_INFOS_BEGIN,
  MONITOR_LAUNCH_GET_LAUNCH_INFOS_SUCCESS,
  MONITOR_LAUNCH_GET_LAUNCH_INFOS_FAILURE,
} from './constants';
import {
  beginContentSpin,
  endContentSpin,
} from '../../common/redux/showContentSpin'

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getLaunchInfos(appName, osName, deviceName) {
  return dispatch => {
    dispatch({
      type: MONITOR_LAUNCH_GET_LAUNCH_INFOS_BEGIN,
    });
    beginContentSpin(dispatch);

    return axios
      .get(`${SERVER_HOST}/app/monitor/launch`, {
        params: {
          app_name: appName,
          os_name: osName,
          device_name: deviceName,
        },
      })
      .then(
        res => {
          dispatch({
            type: MONITOR_LAUNCH_GET_LAUNCH_INFOS_SUCCESS,
            data: {
              items: res.data.data,
            },
          });
          endContentSpin(dispatch);
        },
        err => {
          dispatch({
            type: MONITOR_LAUNCH_GET_LAUNCH_INFOS_FAILURE,
            data: err.message,
          });
          endContentSpin(dispatch);
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case MONITOR_LAUNCH_GET_LAUNCH_INFOS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MONITOR_LAUNCH_GET_LAUNCH_INFOS_SUCCESS:
      return {
        ...state,
        infos: action.data.items,
        loading: false,
        error: null,
      };
    case MONITOR_LAUNCH_GET_LAUNCH_INFOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getLaunchInfos, reducer };
