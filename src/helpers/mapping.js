export const coinDisplay = symbol => {
  switch (symbol) {
    case "tBTCUSD":
      return "BTC/USD";
    default:
      return "";
  }
};
