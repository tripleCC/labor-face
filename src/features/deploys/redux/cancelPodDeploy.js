import axios from 'axios';
import {
  DEPLOYS_CANCEL_POD_DEPLOY_FAILURE,
  DEPLOYS_CANCEL_POD_DEPLOY_SUCCESS,
  DEPLOYS_CANCEL_POD_DEPLOY_BEGIN,
} from './constants';

import {
  beginContentSpin,
  endContentSpin,
} from '../../common/redux/showContentSpin';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function cancelPodDeploy(id, pid, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_CANCEL_POD_DEPLOY_BEGIN,
    });
    return axios.post(`${SERVER_HOST}/deploys/${id}/pods/${pid}/cancel`).then(
      res => {
        endContentSpin(dispatch);
        dispatch({
          type: DEPLOYS_CANCEL_POD_DEPLOY_SUCCESS,
          data: res.data.data,
        });
        if (callback) callback();
      },
      err => {
        endContentSpin(dispatch);
        dispatch({
          type: DEPLOYS_CANCEL_POD_DEPLOY_FAILURE,
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
    case DEPLOYS_CANCEL_POD_DEPLOY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_CANCEL_POD_DEPLOY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DEPLOYS_CANCEL_POD_DEPLOY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { cancelPodDeploy, reducer };
