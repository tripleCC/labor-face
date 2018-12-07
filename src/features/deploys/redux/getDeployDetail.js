import axios from 'axios';
import {
  DEPLOYS_GET_DEPLOY_DETAIL_BEGIN,
  DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS,
  DEPLOYS_GET_DEPLOY_DETAIL_FAILURE,
} from './constants';
import {
  beginContentSpin,
  endContentSpin,
} from '../../common/redux/showContentSpin';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function getDeployDetail(id) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_GET_DEPLOY_DETAIL_BEGIN,
    });
    beginContentSpin(dispatch);
    return axios
      .get(`${SERVER_HOST}/deploys/${id}`)
      .then(
        res => {
          endContentSpin(dispatch);
          dispatch({
            type: DEPLOYS_GET_DEPLOY_DETAIL_SUCCESS,
            data: res.data.data,
          });
        },
        err => {
          endContentSpin(dispatch);
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
        detail: action.data,
        detailById: action.data.pod_deploys.reduce(
          (byId, item) => ({ ...byId, [item.id]: item }),
          {},
        ),
        detailItems: action.data.pod_deploys.map(item => item.id),
        loading: false,
        error: null,
      };
    case DEPLOYS_GET_DEPLOY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { getDeployDetail, reducer };
