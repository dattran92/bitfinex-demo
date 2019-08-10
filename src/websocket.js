import { CONNECT, CHANNEL_RECEIVER } from "./modules/common";
import { UPDATE_BOOK } from "./modules/book";
import { UPDATE_TRADE } from "./modules/trade";
import { UPDATE_TICKER } from "./modules/ticker";

let wss;
let savedStore;
const messageTypes = {
  book: UPDATE_BOOK,
  trades: UPDATE_TRADE,
  ticker: UPDATE_TICKER
};
const channelMap = {};

const connectToGlobalStore = () => {
  wss = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
  wss.onmessage = msg => {
    const data = JSON.parse(msg.data);
    if (data.event && data.event === "subscribed") {
      channelMap[data.chanId] = data;
      savedStore.dispatch({ type: CHANNEL_RECEIVER, payload: data });
    } else if (data.length === 2) {
      const channelId = data[0];
      const channel = channelMap[channelId];
      const channelName = channel.channel;
      const actionType = messageTypes[channelName];
      console.log(channelName, actionType);
      if (actionType) {
        savedStore.dispatch({ type: actionType, payload: data[1] });
      }
      // I'm not sure which te, tu, hb is used for. So I'm skipping it for now
    } else if (data.length === 3) {
      const channelId = data[0];
      const channel = channelMap[channelId];
      const channelName = channel.channel;
      const actionType = messageTypes[channelName];
      if (actionType) {
        savedStore.dispatch({ type: actionType, payload: data[2] });
      }
    }
  };

  wss.onopen = () => {
    // API keys setup here (See "Authenticated Channels")
    savedStore.dispatch({ type: CONNECT, connected: true });
  };

  wss.onclose = () => {
    // API keys setup here (See "Authenticated Channels")
    savedStore.dispatch({ type: CONNECT, connected: false });
  };
};

export const init = store => {
  savedStore = store;
  connectToGlobalStore();
};

export const emit = msg => {
  console.log("send event", msg);
  wss.send(JSON.stringify(msg));
};

export const close = () => {
  wss.close();
};

export const connect = () => {
  connectToGlobalStore();
};
