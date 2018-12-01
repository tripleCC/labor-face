import axios from 'axios';
import {
  DEPLOYS_GET_DEPLOY_LIST_BEGIN,
  DEPLOYS_GET_DEPLOY_LIST_SUCCESS,
  DEPLOYS_GET_DEPLOY_LIST_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';

const initialState = {
  items: [],
  page: 1,
  perPage: 3,
  total: 0,
  byId: {},
  loading: false,
  error: null,
};

// Action
function getDeployList(page = 1, query = {}, perPage = 8) {
  return (dispatch) => {
    dispatch({
      type: DEPLOYS_GET_DEPLOY_LIST_BEGIN,
    });
    return axios
      .get(`${SERVER_HOST}/deploys`, {
        params: {
          page,
          per_page: perPage,
          query,
        },
      })
      .then(
        (res) => {
          dispatch({
            type: DEPLOYS_GET_DEPLOY_LIST_SUCCESS,
            data: {
              items: res.data.data,
              page,
              perPage,
              total: res.data.meta.total_count,
            },
          });
        },
        (err) => {
          dispatch({
            type: DEPLOYS_GET_DEPLOY_LIST_FAILURE,
            data: err,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case DEPLOYS_GET_DEPLOY_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_GET_DEPLOY_LIST_SUCCESS:
      return {
        ...state,
        byId: action.data.items.reduce((byId, item) => ({ ...byId, [item.id]: item }), {}),
        items: action.data.items.map(item => item.id),
        page: action.data.page,
        perPage: action.data.perPage,
        total: action.data.total,
        loading: false,
        error: null,
      };
    case DEPLOYS_GET_DEPLOY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getDeployList, reducer };
