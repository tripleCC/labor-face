import axios from 'axios';
import {
  DEPLOYS_GET_DEPLOY_DETAIL_BEGIN,
  DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS,
  DEPLOYS_GET_DEPLOY_DETAIL_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';

// Action
function getDeployDetail(id) {
  return (dispatch) => {
    dispatch({
      type: DEPLOYS_GET_DEPLOY_DETAIL_BEGIN,
    });
    return axios.get(`${SERVER_HOST}/deploys/${id}`).then(
      (res) => {
        dispatch({
          type: DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS,
          data: res.data,
        });
      },
      (err) => {
        dispatch({
          type: DEPLOYS_GET_DEPLOY_DETAIL_FAILURE,
          data: { error: err },
        });
      },
    );
  };
}

// Reducer
function reducer(state = {}, action) {
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
        deploys: action.data.data,
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
