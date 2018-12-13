import axios from 'axios';
import {
  DEPLOYS_UPDATE_POD_VERSIONS_BEGIN,
  DEPLOYS_UPDATE_POD_VERSIONS_FAILURE,
  DEPLOYS_UPDATE_POD_VERSIONS_SUCCESS,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function updatePodVersions(params, callback) {
  return dispatch => {
    dispatch({
      type: DEPLOYS_UPDATE_POD_VERSIONS_BEGIN,
    });

    return axios
      .post(`${SERVER_HOST}/deploys/pods/versions/update`, params)
      .then(
        res => {
          dispatch({
            type: DEPLOYS_UPDATE_POD_VERSIONS_SUCCESS,
            data: res.data.data,
          });
          if (callback) callback();
        },
        err => {
          dispatch({
            type: DEPLOYS_UPDATE_POD_VERSIONS_FAILURE,
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
    case DEPLOYS_UPDATE_POD_VERSIONS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPLOYS_UPDATE_POD_VERSIONS_SUCCESS:
      const pods = action.data;
      const { detailById } = state;
      pods.forEach(pod => {
        detailById[pod.id] = pod;
      });
      return {
        ...state,
        detailById: { ...detailById },
        loading: false,
        error: null,
      };
    case DEPLOYS_UPDATE_POD_VERSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { updatePodVersions, reducer };
