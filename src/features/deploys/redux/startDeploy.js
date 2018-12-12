import axios from 'axios';
import {
  DEPLOYS_START_DEPLOY_BEGIN,
  DEPLOYS_START_DEPLOY_FAILURE,
  DEPLOYS_START_DEPLOY_SUCCESS,
} from './constants';
import {
  beginContentSpin,
  endContentSpin,
} from '../../common/redux/showContentSpin';
import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function startDeploy(id, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_START_DEPLOY_BEGIN,
    });
    beginContentSpin(dispatch);
    return axios.post(`${SERVER_HOST}/deploys/${id}/deploy`).then(
      res => {
        endContentSpin(dispatch);
        dispatch({
          type: DEPLOYS_START_DEPLOY_SUCCESS,
          data: res.data.data,
        });
        if (callback) callback();
      },
      err => {
        endContentSpin(dispatch);
        dispatch({
          type: DEPLOYS_START_DEPLOY_FAILURE,
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
    case DEPLOYS_START_DEPLOY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_START_DEPLOY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DEPLOYS_START_DEPLOY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { startDeploy, reducer };
