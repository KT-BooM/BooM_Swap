import React, { Component } from 'react'
import bomb from '../bomb.png'
import ethLogo from '../eth-logo.png'


class Main extends Component {
  constructor(props) {
      super(props)
      this.state = {
        output: '0'
      }
    }

  render() {
    return (
      <div id="content">
        <h1>BooM Swap!</h1>
        <div className="card mb-4" >

          <div className="card-body">

          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let etherAmount
              etherAmount = this.input.value.toString()
              etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
              this.props.buyTokens(etherAmount)
            }}>
            <div>
              <label className="float-left"><b>From</b></label>
              <span className="float-right text-muted">
                Balance: {window.web3.utils.fromWei(this.props.balance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                onChange={(event) => {
                  const etherAmount = this.input.value.toString()
                  this.setState({
                    output: etherAmount * 1000
                  })
                }}
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={ethLogo} height='32' alt=""/>
                      ETH       
                </div>
              </div>
            </div>
            <div>
              <label className="float-left"><b>To</b></label>
              <span className="float-right text-muted">
                Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                value={this.state.output}
                disabled
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={bomb} height='32' alt=""/>
                    BOOM
                </div>
              </div>
            </div>
            <div className="mb-5">
              <span className="float-left text-muted">Exchange Rate</span>
              <span className="float-right text-muted">1 ETH = 1000 BOOM</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
          </form>

          </div>

        </div>

      </div>
    );
  }
}

export default Main;
