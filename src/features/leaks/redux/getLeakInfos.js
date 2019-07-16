import axios from 'axios';
import {
  MONITOR_LEAKS_GET_LEAKS_INFOS_BEGIN,
  MONITOR_LEAKS_GET_LEAKS_INFOS_FAILURE,
  MONITOR_LEAKS_GET_LEAKS_INFOS_SUCCESS,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getLeakInfos(page = 1, appName, perPage = 20) {
  return dispatch => {
    dispatch({
      type: MONITOR_LEAKS_GET_LEAKS_INFOS_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/app/monitor/leaks`, {
        params: {
          app_name: appName,
          per_page: perPage,
          page,
        },
      })
      .then(
        res => {
          dispatch({
            type: MONITOR_LEAKS_GET_LEAKS_INFOS_SUCCESS,
            data: {
              page,
              perPage,
              total: res.data.meta.total_count,
              items: res.data.data,
            },
          });
        },
        err => {
          dispatch({
            type: MONITOR_LEAKS_GET_LEAKS_INFOS_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {

  switch (action.type) {
    case MONITOR_LEAKS_GET_LEAKS_INFOS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MONITOR_LEAKS_GET_LEAKS_INFOS_SUCCESS:
      return {
        ...state,
        page: action.data.page,
        perPage: action.data.perPage,
        total: action.data.total,
        items: action.data.items,
        loading: false,
        error: null,
      };
    case MONITOR_LEAKS_GET_LEAKS_INFOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getLeakInfos, reducer };
