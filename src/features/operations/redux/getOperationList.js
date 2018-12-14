import axios from 'axios';
import {
  OPERATIONS_GET_OPERATION_LIST_BEGIN,
  OPERATIONS_GET_OPERATION_LIST_SUCCESS,
  OPERATIONS_GET_OPERATION_LIST_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getOperationList(page = 1, query = {}, perPage = 15) {
  return dispatch => {
    dispatch({
      type: OPERATIONS_GET_OPERATION_LIST_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/operations`, {
        params: {
          page,
          per_page: perPage,
          // query,
        },
      })
      .then(
        res => {
          dispatch({
            type: OPERATIONS_GET_OPERATION_LIST_SUCCESS,
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
            type: OPERATIONS_GET_OPERATION_LIST_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case OPERATIONS_GET_OPERATION_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case OPERATIONS_GET_OPERATION_LIST_SUCCESS:
      return {
        ...state,
        byId: action.data.items.reduce(
          (byId, item) => ({
            ...byId,
            [item.id]: { ...item, deploy: item.pod_deploy || item.main_deploy },
          }),
          {},
        ),
        items: action.data.items.map(item => item.id),
        page: action.data.page,
        perPage: action.data.perPage,
        total: action.data.total,
        loading: false,
        error: null,
      };
    case OPERATIONS_GET_OPERATION_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getOperationList, reducer };
