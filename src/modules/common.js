const initialState = {
  inited: false,
  connected: false,
  symbol: "tBTCUSD",
};

export const CONNECT = 'common/CONNECT';
export const CHANNEL_RECEIVER = 'common/CHANNEL_RECEIVER';

export const closeConnection = () => {
  return (dispatch, getState, { close }) => {
    close();
  }
}

export const openConnection = () => {
  return (dispatch, getState, { connect }) => {
    connect();
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        inited: true,
        connected: action.connected
      };
    default:
      return state;
  }
}
