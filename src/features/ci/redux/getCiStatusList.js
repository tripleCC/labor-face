import axios from 'axios';
import {
  CI_GET_CI_STATUS_LIST_BEGIN,
  CI_GET_CI_STATUS_LIST_FAILURE,
  CI_GET_CI_STATUS_LIST_SUCCESS,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getCiStatusList(page = 1, query = {}, perPage = 10) {
  return dispatch => {
    dispatch({
      type: CI_GET_CI_STATUS_LIST_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/ci/status`, {
        params: {
          page,
          per_page: perPage,
          query,
        },
      })
      .then(
        res => {
          dispatch({
            type: CI_GET_CI_STATUS_LIST_SUCCESS,
            data: {
              items: res.data.data,
              page,
              perPage,
              total: res.data.meta.total_count,
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
