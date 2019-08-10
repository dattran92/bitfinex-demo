import { CHANNEL_RECEIVER } from './common';

const initialState = {
  loading: true,
  chanId: null,
  bids: [],
  asks: [],
  scale: 1,
  precision: "P0"
};

export const UPDATE_BOOK = "book/UPDATE_BOOK";
export const UPDATE_PRECISION = "book/UPDATE_PRECISION";
export const UPDATE_SCALE = "book/UPDATE_SCALE";

export const subscribe = () => {
  return (dispatch, getState, { emit }) => {
    const state = getState();
    const { symbol } = state.common;
    const { chanId, precision } = state.book;
    // could be better by wrapping in emit event????
    if (chanId) { emit({ event: "unsubscribe", chanId: chanId }); }
    emit({
      event: "subscribe",
      channel: "book",
      symbol: symbol,
      prec: precision,
      freq: "F1"
    });
  };
}

export const updatePrecision = (precision) => ({
  type: UPDATE_PRECISION,
  precision
});

export const updateScale = (scale) => ({
  type: UPDATE_SCALE,
  scale
});

// payload: [[price, count, amount]]
// payload: [price, count, amount]
const updateBook = (state, payload) => {
  if (Array.isArray(payload[0])) {
    const bids = payload.filter(item => item[2] > 0);
    const asks = payload.filter(item => item[2] < 0);
    return {
      ...state,
      bids,
      asks
    };
  }

  const [price, count, amount] = payload;

  if (count === 0) {
    if (amount === 1) {
      return {
        ...state,
        bids: state.bids.filter(item => item[0] !== price)
      };
    }

    if (amount === -1) {
      return {
        ...state,
        asks: state.asks.filter(item => item[0] !== price)
      };
    }
  }

  if (count > 0) {
    const key = amount > 0 ? "bids" : "asks";
    const list = state[key];
    const currentIndex = list.findIndex(item => item[0] === price);
    if (currentIndex >= 0) {
      const newList = [...list];
      newList[currentIndex] = payload;
      return {
        ...state,
        [key]: newList.sort((a1, a2) => a2[0] - a1[0])
      };
    }

    return {
      ...state,
      [key]: [...list, payload].sort((a1, a2) => a2[0] - a1[0])
    };
  }

  return state;
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANNEL_RECEIVER:
      if (action.payload.channel === 'book') {
        return {
          ...state,
          chanId: action.payload.chanId
        };
      }
      return state;
    case UPDATE_BOOK:
      return updateBook(state, action.payload);
    case UPDATE_PRECISION:
      return {
        ...state,
        precision: action.precision
      };
    case UPDATE_SCALE:
      return {
        ...state,
        scale: action.scale
      };
    default:
      return state;
  }
}
