import axios from 'axios';

import {
  MONITOR_LEAKS_ADD_LEAK_COMMENT_BEGIN,
  MONITOR_LEAKS_ADD_LEAK_COMMENT_SUCCESS,
  MONITOR_LEAKS_ADD_LEAK_COMMENT_FAILURE,
} from './constants';

import { SERVER_HOST } from '../../../common/constants';
import { initialState } from './reducer';

// Action
function addLeakComment(id, content, callback) {
  return dispatch => {
    dispatch({
      type: MONITOR_LEAKS_ADD_LEAK_COMMENT_BEGIN,
    });
    return axios
      .post(`${SERVER_HOST}/app/monitor/leak/${id}/comments`, { content })
      .then(
        res => {
          dispatch({
            type: MONITOR_LEAKS_ADD_LEAK_COMMENT_SUCCESS,
            data: {
              item: res.data.data,
            },
          });
          if (callback) callback();
        },
        err => {
          dispatch({
            type: MONITOR_LEAKS_ADD_LEAK_COMMENT_FAILURE,
            data: err.message,
          });
        },
      );
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case MONITOR_LEAKS_ADD_LEAK_COMMENT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MONITOR_LEAKS_ADD_LEAK_COMMENT_SUCCESS:
      return {
        ...state,
        items: state.items.map((item) => {
          return action.data.item.id === item.id ? action.data.item : item;
        }),
        loading: false,
        error: null,
      };
    case MONITOR_LEAKS_ADD_LEAK_COMMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    default:
      return state;
  }
}

export { addLeakComment, reducer };
