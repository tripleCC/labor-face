import axios from 'axios';
import {
  MONITOR_LAUNCH_GET_DEVICES_BEGIN,
  MONITOR_LAUNCH_GET_DEVICES_SUCCESS,
  MONITOR_LAUNCH_GET_DEVICES_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getDevices() {
  return dispatch => {
    dispatch({
      type: MONITOR_LAUNCH_GET_DEVICES_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/device/all`)
      .then(
        res => {
          dispatch({
            type: MONITOR_LAUNCH_GET_DEVICES_SUCCESS,
            data: {
              items: res.data.data,
            },
          });
        },
        err => {
          dispatch({
            type: MONITOR_LAUNCH_GET_DEVICES_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {

  switch (action.type) {
    case MONITOR_LAUNCH_GET_DEVICES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MONITOR_LAUNCH_GET_DEVICES_SUCCESS:
      return {
        ...state,
        devices: initialState.devices.concat(
          action.data.items
            .map(item => item.simple_name)
            .filter(item => item != null)
            .sort()
          ),
        loading: false,
        error: null,
      };
    case MONITOR_LAUNCH_GET_DEVICES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getDevices, reducer };
