import {
  COMMON_SHOW_CONTENT_SPIN_BEGIN,
  COMMON_SHOW_CONTENT_SPIN_END,
} from './constants';

import { initialState } from './reducer';

// Action
function beginContentSpin(dispatch, tip) {
  dispatch({
    type: COMMON_SHOW_CONTENT_SPIN_BEGIN,
    data: { contentSpinTip: tip },
  });
}

function endContentSpin(dispatch) {
  dispatch({
    type: COMMON_SHOW_CONTENT_SPIN_END,
  });
}

// Reducer
function reducer(state = initialState, action) {

  switch (action.type) {
    case COMMON_SHOW_CONTENT_SPIN_BEGIN:
      return {
        ...state,
        contentSpinning: true,
        contentSpinTip: action.data.contentSpinTip,
      };
    case COMMON_SHOW_CONTENT_SPIN_END:
      return {
        ...state,
        contentSpinning: false,
        contentSpinTip: null,
      };
    default:
      return state;
  }
}

export { beginContentSpin, endContentSpin, reducer };
