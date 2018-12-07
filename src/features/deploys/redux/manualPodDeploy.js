import axios from 'axios';
import {
  DEPLOYS_MANUAL_POD_DEPLOY_BEGIN,
  DEPLOYS_MANUAL_POD_DEPLOY_SUCCESS,
  DEPLOYS_MANUAL_POD_DEPLOY_FAILURE,
} from './constants';

import {
  beginContentSpin,
  endContentSpin,
} from '../../common/redux/showContentSpin';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function manualPodDeploy(id, pid, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_MANUAL_POD_DEPLOY_BEGIN,
    });
    return axios.post(`${SERVER_HOST}/deploys/${id}/pods/${pid}/manual`).then(
      res => {
        dispatch({
          type: DEPLOYS_MANUAL_POD_DEPLOY_SUCCESS,
          data: res.data.data,
        });
        if (callback) callback();
      },
      err => {
        dispatch({
          type: DEPLOYS_MANUAL_POD_DEPLOY_FAILURE,
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
    case DEPLOYS_MANUAL_POD_DEPLOY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_MANUAL_POD_DEPLOY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DEPLOYS_MANUAL_POD_DEPLOY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { manualPodDeploy, reducer };
