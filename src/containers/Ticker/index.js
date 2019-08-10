import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classnames from "classnames";
import NumericLabel from 'react-pretty-numbers';

import { subscribe } from "../../modules/ticker";
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
  loading: state.ticker.loading,
  data: state.ticker.data
});

class Ticker extends Component {
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
    const { symbol, data, loading } = this.props;

    if (loading) return null;

    return (
      <div className="card">
        <div className="card-body small">
          <div className="d-flex justify-content-between">
            <div>
              { /* hard code for BTCUSD only */ }
              <img
                src="https://www.bitfinex.com/assets/BTC-alt-1ca8728fcf2bc179dfe11f9a0126bc303bee888bff8132c5ff96a4873cf9f0fb.svg"
                width="50"
                height="50"
                alt="BTC"
              />
            </div>
            <div>
              <h5 className="mb-0">{coinDisplay(symbol)}</h5>
              <div>VOL <NumericLabel>{(data.ask * data.ffr).toFixed(0)}</NumericLabel> USD</div>
              <div>LOW <NumericLabel>{data.last_price}</NumericLabel></div>
            </div>
            <div>
              <h5 className="mb-0"><NumericLabel>{data.ffr}</NumericLabel></h5>
              <div className={classnames({
                'text-danger': data.daily_change < 0,
                'text-success': data.daily_change > 0,
              })}>
                <i className={classnames('fa', {
                  'fa-caret-down': data.daily_change < 0,
                  'fa-caret-up': data.daily_change > 0,
                })} />
                <span><NumericLabel>{data.daily_change.toFixed(0)}</NumericLabel></span>
                <span>({(data.daily_change_perc * 100).toFixed(2)}%)</span>
              </div>
              <div>HIGH <NumericLabel>{data.ask_period}</NumericLabel></div>
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
)(Ticker);
