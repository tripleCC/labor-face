import {
  COMMON_SHOW_GLOBAL_SPIN_BEGIN,
  COMMON_SHOW_GLOBAL_SPIN_END,
} from './constants';

const initialState = {
  globalSpinning: false,
  globalSpinTip: null,
};

// Action
function beginGlobalSpin(dispatch, tip) {
  dispatch({
    type: COMMON_SHOW_GLOBAL_SPIN_BEGIN,
    data: { globalSpinTip: tip },
  });
}

function endGlobalSpin(dispatch) {
  dispatch({
    type: COMMON_SHOW_GLOBAL_SPIN_END,
  });
}

// Reducer
function reducer(state = initialState, action) {
  console.log(action)
  switch (action.type) {
    case COMMON_SHOW_GLOBAL_SPIN_BEGIN:
      return {
        ...state,
        globalSpinning: true,
        globalSpinTip: action.data.globalSpinTip,
      };
    case COMMON_SHOW_GLOBAL_SPIN_END:
      return {
        ...state,
        globalSpinning: false,
        globalSpinTip: null,
      };
    default:
      return state;
  }
}

export { beginGlobalSpin, endGlobalSpin, reducer };
