import axios from 'axios';
import {
  USER_GET_USER_INFO_BEGIN,
  USER_GET_USER_INFO_FAILURE,
  USER_GET_USER_INFO_SUCCESS,
  USER_LOGOUT_SUCCESS,
} from './constants';

import {
  SERVER_HOST,
  YO_CLIENT_ID,
  YO_CLIENT_SECRET,
  YO_OAUTH_REDIRECT_URI,
  YO_OAUTH_HOST,
} from '../../../common/constants';

import {
  beginGlobalSpin,
  endGlobalSpin,
} from '../../common/redux/showGlobalSpin';

function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
  localStorage.removeItem('user');
}

const user = getUser()
const initialState = {
  info: user,
  logined: !!user
};

// Action
function getUserInfo(code) {
  return dispatch => {
    dispatch({
      type: USER_GET_USER_INFO_BEGIN,
    });
    beginGlobalSpin(dispatch, '登录中...');

    return axios
      .get(`${SERVER_HOST}/oauth/resource/user`, {
        params: {
          client_id: YO_CLIENT_ID,
          client_secret: YO_CLIENT_SECRET,
          code: code,
          redirect_uri: YO_OAUTH_REDIRECT_URI,
          host: YO_OAUTH_HOST,
        },
      })
      .then(
        res => {
          const user = !!res.data && res.data.data;
          if (!!user) {
            saveUser(user);
          }

          dispatch({
            type: USER_GET_USER_INFO_SUCCESS,
            data: user,
          });
        },
        err => {
          dispatch({
            type: USER_GET_USER_INFO_FAILURE,
            data: err,
          });
        },
      )
      .finally(() => {
        endGlobalSpin(dispatch);
      });
  };
}

function logout() {
  return dispatch => {
    removeUser();
    dispatch({ type: USER_LOGOUT_SUCCESS });
  };
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_GET_USER_INFO_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case USER_GET_USER_INFO_SUCCESS:
      return {
        ...state,
        info: action.data,
        logined: true,
        loading: false,
        error: null,
      };
    case USER_GET_USER_INFO_FAILURE:
      return {
        ...state,
        logined: false,
        loading: false,
        error: action.data,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        info: null,
        logined: false,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
}

export { getUserInfo, reducer, removeUser, getUser, saveUser, logout };
