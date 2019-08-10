import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { closeConnection, openConnection } from "./modules/common";

import Book from "./containers/Book";
import Trade from "./containers/Trade";
import Ticker from "./containers/Ticker";

import "./App.css";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeConnection,
      openConnection
    },
    dispatch
  );

const mapStateToProps = state => ({
  inited: state.common.inited,
  connected: state.common.connected
});

class App extends Component {
  render() {
    const { inited, connected, closeConnection, openConnection } = this.props;
    return (
      <div className="app">
        <div className="app-header">
          <h2>Bitfinex Demo</h2>
        </div>
        <div className="container-fluid">
          <div className="row my-3">
            <div className="col-md-12">
              {inited && (
                <a
                  onClick={() => {
                    if (connected) {
                      closeConnection();
                    } else {
                      openConnection();
                    }
                  }}
                  className="btn btn-primary cursor-pointer"
                >
                  { connected ? 'Disconnect' : 'Connect'}
                </a>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <Book />
            </div>
            <div className="col-md-4">
              <div className="mb-2">
                <Ticker />
              </div>
              <Trade />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
