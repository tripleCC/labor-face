import reduceReducers from 'reduce-reducers';
import { reducer as showGlobalSpinReducer } from './showGlobalSpin';
import { reducer as showContentSpinReducer } from './showContentSpin';

export const initialState = {
  contentSpinning: false,
  contentSpinTip: null,
  globalSpinning: false,
  globalSpinTip: null,
};

const reducer = reduceReducers(showGlobalSpinReducer, showContentSpinReducer);

export default reducer;
