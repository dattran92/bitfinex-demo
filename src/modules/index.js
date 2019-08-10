import { combineReducers } from 'redux';

import common from './common';
import book from './book';
import trade from './trade';
import ticker from './ticker';

export default combineReducers({
  common,
  book,
  trade,
  ticker
});
