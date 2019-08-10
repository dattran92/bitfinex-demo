import { CHANNEL_RECEIVER } from "./common";

export const UPDATE_TICKER = "ticker/UPDATE_TICKER";

const initialState = {
  loading: true,
  chanId: null,
  data: {}
};

export const subscribe = () => {
  return (dispatch, getState, { emit }) => {
    const state = getState();
    const { symbol } = state.common;
    const { chanId } = state.book;
    // could be better by wrapping in emit event????
    if (chanId) {
      emit({ event: "unsubscribe", chanId: chanId });
    }
    emit({
      event: "subscribe",
      channel: "ticker",
      symbol: symbol
    });
  };
};

// the position of the fields could be wrong, check again later
const updateTicker = (state, payload) => {
  if (Array.isArray(payload)) {
    const [
      ffr,
      bid,
      bid_period,
      bid_size,
      daily_change,
      daily_change_perc,
      ask_size,
      ask,
      ask_period,
      last_price,
      volumn,
      high,
      low
    ] = payload;
    return {
      ...state,
      loading: false,
      data: {
        ffr,
        bid,
        bid_period,
        bid_size,
        ask,
        ask_period,
        ask_size,
        daily_change,
        daily_change_perc,
        last_price,
        volumn,
        high,
        low
      }
    };
  }

  return state;
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANNEL_RECEIVER:
      if (action.payload.channel === "ticker") {
        return {
          ...state,
          chanId: action.payload.chanId
        };
      }
      return state;
    case UPDATE_TICKER:
      return updateTicker(state, action.payload);
    default:
      return state;
  }
}
