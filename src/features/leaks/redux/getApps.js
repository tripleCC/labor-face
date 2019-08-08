import axios from 'axios';
import {
  MONITOR_LEAKS_GET_APPS_BEGIN,
  MONITOR_LEAKS_GET_APPS_SUCCESS,
  MONITOR_LEAKS_GET_APPS_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getApps(callback = null) {
  return dispatch => {
    dispatch({
      type: MONITOR_LEAKS_GET_APPS_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/app/all`)
      .then(
        res => {
          dispatch({
            type: MONITOR_LEAKS_GET_APPS_SUCCESS,
            data: {
              items: res.data.data,
            },
          });
          if (callback) callback();
        },
        err => {
          dispatch({
            type: MONITOR_LEAKS_GET_APPS_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {

  switch (action.type) {
    case MONITOR_LEAKS_GET_APPS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MONITOR_LEAKS_GET_APPS_SUCCESS:
      return {
        ...state,
        appNames: Array.from(new Set(action.data.items.map((i) => i.name))),
        loading: false,
        error: null,
      };
    case MONITOR_LEAKS_GET_APPS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getApps, reducer };
