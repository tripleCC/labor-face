import axios from 'axios';
import {
  MONITOR_LEAKS_FIX_LEAKS_INFO_BEGIN,
  MONITOR_LEAKS_FIX_LEAKS_INFO_FAILURE,
  MONITOR_LEAKS_FIX_LEAKS_INFO_SUCCESS,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function fixLeakInfo(id, callback) {
  return dispatch => {
    dispatch({
      type: MONITOR_LEAKS_FIX_LEAKS_INFO_BEGIN,
    });
    return axios
      .post(`${SERVER_HOST}/app/monitor/leaks/${id}/fix`)
      .then(
        res => {
          dispatch({
            type: MONITOR_LEAKS_FIX_LEAKS_INFO_SUCCESS,
            data: {
              item: res.data.data,
            },
          });
          if (callback) callback();
        },
        err => {
          dispatch({
            type: MONITOR_LEAKS_FIX_LEAKS_INFO_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case MONITOR_LEAKS_FIX_LEAKS_INFO_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MONITOR_LEAKS_FIX_LEAKS_INFO_SUCCESS:
      return {
        ...state,
        items: state.items.map((item) => {
          return action.data.item.id === item.id ? action.data.item : item;
        }),
        loading: false,
        error: null,
      };
    case MONITOR_LEAKS_FIX_LEAKS_INFO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { fixLeakInfo, reducer };
