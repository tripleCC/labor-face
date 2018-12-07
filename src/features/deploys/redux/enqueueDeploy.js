import axios from 'axios';
import {
  DEPLOYS_ENQUEUE_DEPLOY_BEGIN,
  DEPLOYS_ENQUEUE_DEPLOY_SUCCESS,
  DEPLOYS_ENQUEUE_DEPLOY_FAILURE,
} from './constants';

import {
  beginContentSpin,
  endContentSpin,
} from '../../common/redux/showContentSpin';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function enqueueDeploy(id, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_ENQUEUE_DEPLOY_BEGIN,
    });
    beginContentSpin(dispatch, '分析依赖中，耗时可能较久，请耐心等待...');
    return axios.post(`${SERVER_HOST}/deploys/${id}/enqueue`).then(
      res => {
        endContentSpin(dispatch);
        dispatch({
          type: DEPLOYS_ENQUEUE_DEPLOY_SUCCESS,
          data: res.data.data,
        });
        if (callback) callback();
      },
      err => {
        endContentSpin(dispatch);
        dispatch({
          type: DEPLOYS_ENQUEUE_DEPLOY_FAILURE,
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
    case DEPLOYS_ENQUEUE_DEPLOY_BEGIN:
      return {
        ...state,
        error: null,
      };
    case DEPLOYS_ENQUEUE_DEPLOY_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case DEPLOYS_ENQUEUE_DEPLOY_FAILURE:
      return {
        ...state,
        error: action.data,
      };
    default:
      return state;
  }
}

export { enqueueDeploy, reducer };
