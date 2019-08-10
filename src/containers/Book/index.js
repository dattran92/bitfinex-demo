import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classnames from "classnames";
import NumericLabel from "react-pretty-numbers";

import { subscribe, updatePrecision, updateScale } from "../../modules/book";
import { coinDisplay } from "../../helpers/mapping";
import "./style.css";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      subscribe,
      updatePrecision,
      updateScale
    },
    dispatch
  );

const mapStateToProps = state => ({
  connected: state.common.connected,
  symbol: state.common.symbol,
  loading: state.book.loading,
  precision: state.book.precision,
  scale: state.book.scale,
  bids: state.book.bids,
  asks: state.book.asks
});

const listPrecision = ["P0", "P1", "P2", "P3", "P4"];

const BookColumn = ({ list, type, scale, largestTotal }) => (
  <div className="col-6">
    <div
      className={classnames("row", {
        "row-revese": type === "ask"
      })}
    >
      <div className="col-3">Count</div>
      <div className="col-3">Amount</div>
      <div className="col-3">Total</div>
      <div className="col-3">Price</div>
    </div>
    {list.map(item => (
      <div className="row position-relative" key={item.price}>
        <div
          className={classnames(`percentage-bar ${type}-percentage-bar`, {
            "bg-success-light": type === "bid",
            "bg-danger-light": type === "ask"
          })}
          style={{
            width: `${((item.total / largestTotal) * 100 * scale).toFixed(2)}%`
          }}
        />
        <div className="col-3">
          <NumericLabel>{item.count}</NumericLabel>
        </div>
        <div className="col-3">
          <NumericLabel>{item.amount}</NumericLabel>
        </div>
        <div className="col-3">
          <NumericLabel>{item.total}</NumericLabel>
        </div>
        <div className="col-3">
          <NumericLabel>{item.price}</NumericLabel>
        </div>
      </div>
    ))}
  </div>
);

class Book extends Component {
  componentWillMount() {
    if (this.props.connected) {
      this._setup(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const connected = nextProps.connected && !this.props.connected;
    const changedPair = nextProps.symbol !== this.props.symbol;
    const changedPrecision = nextProps.precision !== this.props.precision;
    if (connected || changedPair || changedPrecision) {
      this._setup(nextProps);
    }
  }

  _setup(props) {
    props.subscribe();
  }

  render() {
    const {
      symbol,
      bids,
      asks,
      precision,
      scale,
      updatePrecision,
      updateScale
    } = this.props;

    let bidTotal = 0,
      askTotal = 0;
    let prevPrecision, nextPrecision;
    const bidList = bids.map(bid => {
      const [price, count, amount] = bid;
      bidTotal += amount;
      return {
        price,
        count,
        amount: amount.toFixed(2),
        total: bidTotal.toFixed(2)
      };
    });

    const askList = asks.map(ask => {
      const [price, count, amount] = ask;
      const absAmount = Math.abs(amount);
      askTotal += absAmount;
      return {
        price,
        count,
        amount: absAmount.toFixed(2),
        total: askTotal.toFixed(2)
      };
    });

    const largestTotal = bidTotal > askTotal ? bidTotal : askTotal;

    const currentPrecisionIndex = listPrecision.indexOf(precision);
    if (currentPrecisionIndex > 0) {
      nextPrecision = listPrecision[currentPrecisionIndex - 1];
    }

    if (currentPrecisionIndex < listPrecision.length) {
      prevPrecision = listPrecision[currentPrecisionIndex + 1];
    }

    return (
      <div className="card ">
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <div>
              ORDER BOOK <span className="small text-muted">{coinDisplay(symbol)}</span>
            </div>
            <div className="small">
              <i
                className={classnames("fa fa-minus mx-1", {
                  "cursor-pointer": prevPrecision,
                  "text-muted": !prevPrecision
                })}
                onClick={() => {
                  if (prevPrecision) updatePrecision(prevPrecision);
                }}
              />
              <i
                className={classnames("fa fa-plus mx-1", {
                  "cursor-pointer": nextPrecision,
                  "text-muted": !nextPrecision
                })}
                onClick={() => {
                  if (nextPrecision) updatePrecision(nextPrecision);
                }}
              />
              <i
                className="fa fa-search-minus mx-1 cursor-pointer"
                onClick={() => updateScale(scale / 2)}
              />
              <i
                className="fa fa-search-plus mx-1 cursor-pointer"
                onClick={() => updateScale(scale * 2)}
              />
            </div>
          </div>
        </div>
        <div className="card-body small overflow-hidden">
          <div className="row">
            <BookColumn
              list={bidList}
              scale={scale}
              largestTotal={largestTotal}
              type="bid"
            />
            <BookColumn
              list={askList}
              scale={scale}
              largestTotal={largestTotal}
              type="ask"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
