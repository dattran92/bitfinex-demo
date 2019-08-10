import { CHANNEL_RECEIVER } from './common';

const initialState = {
  loading: true,
  chanId: null,
  list: [],
};

export const UPDATE_TRADE = "trade/UPDATE_TRADE";

export const subscribe = () => {
  return (dispatch, getState, { emit }) => {
    const state = getState();
    const { symbol } = state.common;
    const { chanId } = state.book;
    // could be better by wrapping in emit event????
    if (chanId) { emit({ event: "unsubscribe", chanId: chanId }); }
    emit({
      event: "subscribe",
      channel: "trades",
      symbol: symbol,
      freq: "F1"
    });
  };
}


// payload: [[_, time, amount, price]]
// payload: [_, time, amount, price]
const updateTrade = (state, payload) => {
  if (!payload) {
    return state;
  }

  if (Array.isArray(payload[0])) {
    return {
      ...state,
      list: payload
    };
  }

  if (Array.isArray(payload)) {
    const newList = [...state.list];
    newList.push(payload);
    newList.shift();

    return {
      ...state,
      list: newList
    };
  }

  return state;
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANNEL_RECEIVER:
      if (action.payload.channel === 'trades') {
        return {
          ...state,
          chanId: action.payload.chanId
        };
      }
      return state;
    case UPDATE_TRADE:
      return updateTrade(state, action.payload)
    default:
      return state;
  }
}
