import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import 'bootstrap-css-only/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';

import App from "./App";
import configureStore from "./store";

import "./index.css";

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);
