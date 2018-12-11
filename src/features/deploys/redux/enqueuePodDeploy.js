import axios from 'axios';
import {
  DEPLOYS_ENQUEUE_POD_DEPLOY_FAILURE,
  DEPLOYS_ENQUEUE_POD_DEPLOY_SUCCESS,
  DEPLOYS_ENQUEUE_POD_DEPLOY_BEGIN,
} from './constants';


import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function enqueuePodDeploy(id, pid, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_ENQUEUE_POD_DEPLOY_BEGIN,
    });
    return axios.post(`${SERVER_HOST}/deploys/${id}/pods/${pid}/enqueue`).then(
      res => {
        dispatch({
          type: DEPLOYS_ENQUEUE_POD_DEPLOY_SUCCESS,
          data: res.data.data,
        });
        if (callback) callback();
      },
      err => {
        dispatch({
          type: DEPLOYS_ENQUEUE_POD_DEPLOY_FAILURE,
          data: !err.response
            ? err.message
            : err.response.data.errors.join(', '),
        });
      },
    );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case DEPLOYS_ENQUEUE_POD_DEPLOY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_ENQUEUE_POD_DEPLOY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DEPLOYS_ENQUEUE_POD_DEPLOY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { enqueuePodDeploy, reducer };
