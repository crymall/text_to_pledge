import React, { Component } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      total: 0,
      pledges: []
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
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
      })
      .then(() => {
        setTimeout(this.getInfo, 20000);
      });
  };

  render() {
    const { total, pledges } = this.state;
    const goal = 10000;
    let totalPercent;
    let exceedMessage;

    if (total >= goal) {
      totalPercent = 100;
      exceedMessage = `Total raised: $${total} !`;
    } else {
      totalPercent = (total / goal) * 100;
    }

    let randomPledge;
    let randomFormattedPledge;
    let largestPledge;
    let largestFormattedPledge;
    let recentPledge;
    let recentFormattedPledge;

    if (pledges.length) {
      randomPledge = pledges[Math.floor(Math.random() * pledges.length)];

      randomFormattedPledge = (
        <div className="single-pledge">
          <h3>Random Pledge</h3>
          <h3 className="pledge-title">
            {randomPledge.name} donated ${randomPledge.amount}
          </h3>
          {randomPledge.message ? (
            <h4 className="pledge-body">"{randomPledge.message}"</h4>
          ) : (
            ""
          )}
        </div>
      );

      largestPledge = pledges.reduce((acc, el) => {
        return el > acc ? el : acc;
      });

      largestFormattedPledge = (
        <div className="single-pledge">
          <h3>Largest Pledge:</h3>
          <h3 className="pledge-title">
            {largestPledge.name} donated ${largestPledge.amount}
          </h3>
          {largestPledge.message ? (
            <h4 className="pledge-body">"{largestPledge.message}"</h4>
          ) : (
            ""
          )}
        </div>
      );

      recentPledge = pledges[pledges.length - 1];

      recentFormattedPledge = (
        <div className="single-pledge">
          <h3>Most Recent Pledge:</h3>
          <h3 className="pledge-title">
            {recentPledge.name} donated ${recentPledge.amount}
          </h3>
          {recentPledge.message ? (
            <h4 className="pledge-body">"{recentPledge.message}"</h4>
          ) : (
            ""
          )}
        </div>
      );
    }

    return (
      <div className="App">
        <div className="header-area">
          <h1> PURSUIT BASH </h1>
          <div className="monogram" />
        </div>

        <div className="main-area">
          <div className="content-area">
            <h3 className="pledge-instructions">
              Text "hi" to (347) 527-4222 to make a pledge
            </h3>
          </div>
          <div className="pledge-area">
            {largestFormattedPledge}
            {recentFormattedPledge}
            {randomFormattedPledge}
          </div>
        </div>

        <div className="lower-area">
          <Line
            className="the-bar"
            percent={totalPercent.toString()}
            strokeWidth="2"
            strokeColor="#1E1E1E"
            strokeLinecap="butt"
            trailColor="#E3E3E3"
            trailWidth="1"
          />
          <div className="bar-tics">
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className="tic-highlight"> 0 </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 25 ? "tic-highlight" : "tic"}>
                {" "}
                2.5K{" "}
              </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 50 ? "tic-highlight" : "tic"}>
                {" "}
                5K{" "}
              </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 75 ? "tic-highlight" : "tic"}>
                {" "}
                7.5K{" "}
              </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 100 ? "tic-highlight" : "tic"}>
                {" "}
                10K{" "}
              </h3>
            </div>
          </div>
          <h3>{exceedMessage}</h3>
        </div>
      </div>
    );
  }
}

export default App;
