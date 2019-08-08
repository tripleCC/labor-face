import reduceReducers from 'reduce-reducers';
import {reducer as getLeakInfosReducer} from './getLeakInfos'
import {reducer as fixLeakInfoReducer} from './fixLeakInfo'
import {reducer as addLeakCommentReducer} from './addLeakComment'
export const initialState = {
  loading: false,
  error: null,
  items: [],
};
const reducer = reduceReducers(
  fixLeakInfoReducer,
  getLeakInfosReducer,
  addLeakCommentReducer,
);

export default reducer;
