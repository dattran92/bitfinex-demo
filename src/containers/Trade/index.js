import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classnames from "classnames";
import NumericLabel from "react-pretty-numbers";

import { subscribe } from "../../modules/trade";
import { displayTime } from "../../helpers/time";
import { coinDisplay } from "../../helpers/mapping";
import "./style.css";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      subscribe
    },
    dispatch
  );

const mapStateToProps = state => ({
  connected: state.common.connected,
  symbol: state.common.symbol,
  loading: state.trade.loading,
  list: state.trade.list
});

class Trade extends Component {
  componentWillMount() {
    if (this.props.connected) {
      this._setup(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const connected = nextProps.connected && !this.props.connected;
    const changedPair = nextProps.symbol !== this.props.symbol;
    if (connected || changedPair) {
      this._setup(nextProps);
    }
  }

  _setup(props) {
    props.subscribe();
  }

  render() {
    const { symbol, list } = this.props;

    return (
      <div className="card ">
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <div>
              TRADES <span className="small text-muted">{coinDisplay(symbol)}</span>
            </div>
          </div>
        </div>
        <div className="card-body small">
          <div className="row">
            <div className="col-1" />
            <div className="col-3">Time</div>
            <div className="col-4">Price</div>
            <div className="col-4">Amount</div>
          </div>
          {list.map((tr, index) => {
            const [_, time, amount, price] = tr;
            return (
              <div
                className={classnames("row", {
                  "bg-success-light": amount > 0,
                  "bg-danger-light": amount < 0
                })}
                key={index}
              >
                <div className="col-1">
                  <i
                    className={classnames("fa", {
                      "fa-angle-up text-success": amount > 0,
                      "fa-angle-down text-danger": amount < 0
                    })}
                  />
                </div>
                <div className="col-3">{displayTime(time)}</div>
                <div className="col-4">
                  <NumericLabel>{price.toFixed(0)}</NumericLabel>
                </div>
                <div className="col-4">{Math.abs(amount).toFixed(4)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trade);
