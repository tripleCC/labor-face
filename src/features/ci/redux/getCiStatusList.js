import axios from 'axios';
import {
  CI_GET_CI_STATUS_LIST_BEGIN,
  CI_GET_CI_STATUS_LIST_FAILURE,
  CI_GET_CI_STATUS_LIST_SUCCESS,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getCiStatusList(query = {}) {
  return dispatch => {
    dispatch({
      type: CI_GET_CI_STATUS_LIST_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/ci/status`, {
        params: {
          page: 1,
          per_page: 10,
          ...query,
        },
      })
      .then(
        res => {
          dispatch({
            type: CI_GET_CI_STATUS_LIST_SUCCESS,
            data: {
              items: res.data.data,
              page: query.page,
              perPage: query.perPage,
              total: res.data.meta.total_count,
              teams: res.data.meta.teams,
              owners: res.data.meta.owners,
            },
          });
        },
        err => {
          dispatch({
            type: CI_GET_CI_STATUS_LIST_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case CI_GET_CI_STATUS_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CI_GET_CI_STATUS_LIST_SUCCESS:
      return {
        ...state,
        byId: action.data.items.reduce(
          (byId, item) => ({ ...byId, [item.id]: item }),
          {},
        ),
        items: action.data.items.map(item => item.id),
        page: action.data.page,
        perPage: action.data.perPage,
        total: action.data.total,
        teams: action.data.teams,
        owners: action.data.owners,
        loading: false,
        error: null,
      };
    case CI_GET_CI_STATUS_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getCiStatusList, reducer };
