import axios from 'axios';
import {
  DEPLOYS_GET_DEPLOY_DETAIL_BEGIN,
  DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS,
  DEPLOYS_GET_DEPLOY_DETAIL_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';

const initialState = {
  owner: '无',
  status: 'analyzing',
  createdAt: new Date().toLocaleDateString,
  shouldPushDing: false,
  failureReason: null,
  pods: [],
  loading: false,
  error: null,
};

// Action
function getDeployDetail(id) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_GET_DEPLOY_DETAIL_BEGIN,
    });
    return axios.get(`${SERVER_HOST}/deploys/${id}`).then(
      res => {
        dispatch({
          type: DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS,
          data: res.data.data,
        });
      },
      err => {
        dispatch({
          type: DEPLOYS_GET_DEPLOY_DETAIL_FAILURE,
          data: err.message,
        });
      },
    );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case DEPLOYS_GET_DEPLOY_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS:
      return {
        ...state,
        owner: !!action.data.user && action.data.user.nickname,
        createdAt: action.data.created_at,
        status: action.data.status,
        failureReason: action.data.failure_reason,
        shouldPushDing: action.data.should_push_ding,
        pods: action.data.pod_deploys,
        loading: false,
        error: null,
      };
    case DEPLOYS_GET_DEPLOY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data.error,
      };
    default:
      return state;
  }
}

export { getDeployDetail, reducer };
