import axios from 'axios';
import {
  DEPLOYS_DELETE_DEPLOY_BEGIN,
  DEPLOYS_DELETE_DEPLOY_SUCCESS,
  DEPLOYS_DELETE_DEPLOY_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function deleteDeploy(id, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_DELETE_DEPLOY_BEGIN,
    });
    return axios
      .post(`${SERVER_HOST}/deploys/${id}/delete`)
      .then(
        res => {
          dispatch({
            type: DEPLOYS_DELETE_DEPLOY_SUCCESS,
            data: res.data.data,
          });
          if (callback) callback();
        },
        err => {
          dispatch({
            type: DEPLOYS_DELETE_DEPLOY_FAILURE,
            data: !err.response ? err.message : err.response.data.errors.join(', '),
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case DEPLOYS_DELETE_DEPLOY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_DELETE_DEPLOY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DEPLOYS_DELETE_DEPLOY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { deleteDeploy, reducer };
