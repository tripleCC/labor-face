import axios from 'axios';
import {
  DEPLOYS_ADD_DEPLOY_BEGIN,
  DEPLOYS_ADD_DEPLOY_FAILURE,
  DEPLOYS_ADD_DEPLOY_SUCCESS,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';

const initialState = {
  loading: false,
  error: null,
};

// Action
function addDeploy(name, repo_url, ref, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_ADD_DEPLOY_BEGIN,
    });
    return axios
      .post(`${SERVER_HOST}/deploys`, {
        name,
        repo_url,
        ref,
      })
      .then(
        res => {
          dispatch({
            type: DEPLOYS_ADD_DEPLOY_SUCCESS,
            data: res.data.data,
          });
          if (callback) callback();
        },
        err => {
          dispatch({
            type: DEPLOYS_ADD_DEPLOY_FAILURE,
            data: err ,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case DEPLOYS_ADD_DEPLOY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_ADD_DEPLOY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DEPLOYS_ADD_DEPLOY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { addDeploy, reducer };
