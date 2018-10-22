import React, { Component } from "react";
import axios from "axios";
import wordmark from "./assets/wordmark.png";
import { Line } from "rc-progress";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      total: 0,
      pledges: {}
    };
  }

  componentDidMount() {
    axios
      .get("/total")
      .then(res => {
        return res.data.total.sum;
      })
      .then(total => {
        axios.get("/pledges").then(res => {
          this.setState({
            total: total,
            pledges: res.data.pledges
          });
        });
      });
  }

  render() {
    const { total, pledges } = this.state;
    let singlePledge;
    let displayPledge;

    if (pledges !== {}) {
      singlePledge = pledges[Math.floor(Math.random() * pledges.length)];

      displayPledge = (
        <div className="single-pledge">
          <h3>{singlePledge.message}</h3>
          <h3>{singlePledge.amount}</h3>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="header-area">
          <h1> PURSUIT BASH </h1>
        </div>

        <div className="main-area">
          <div className="content-area">
            <h3> Welcome to the celebration </h3>
          </div>
          <div className="donation-area">{displayPledge}</div>
        </div>

        <div className="lower-area">
          <Line
            className="the-bar"
            percent={((total / 10000) * 100).toString()}
            strokeWidth="2"
            strokeColor="#1E1E1E"
            strokeLinecap="butt"
            trailColor="#E3E3E3"
            trailWidth="1"
          />
          <div className="bar-tics">
            <div className="tic">
              <h3> | </h3>
              <h3> 0 </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 2.5K </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 5K </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 7.5K </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 10K </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
