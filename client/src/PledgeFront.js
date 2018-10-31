import React, { Component } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import "./App.css";

class PledgeFront extends Component {
  constructor() {
    super();
    this.state = {
      total: 0,
      totalDonors: 0,
      pledges: []
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    axios.get("/total").then(total => {
      axios.get("/people").then(people => {
        axios.get("/pledges").then(pledges => {
          this.setState({
            total: total.data.total,
            totalDonors: people.data.total,
            pledges: pledges.data.pledges
          });
          setTimeout(this.getInfo, 5000);
        });
      });
    });
  };

  render() {
    const { total, totalDonors, pledges } = this.state;
    const goal = 75000;
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
          <h3 className="pledge-category">All Pledges:</h3>
          <h3 className="pledge-title">
            {randomPledge.name} pledged ${randomPledge.amount}
          </h3>
          {randomPledge.message ? (
            <h4 className="pledge-body">"{randomPledge.message}"</h4>
          ) : (
            <h4 className="pledge-body">Thank You</h4>
          )}
        </div>
      );

      largestPledge = pledges.reduce((acc, el) => {
        return el.amount > acc.amount ? el : acc;
      });

      largestFormattedPledge = (
        <div className="single-pledge">
          <h3 className="pledge-category">Largest Pledge:</h3>
          <h3 className="pledge-title">
            {largestPledge.name} pledged ${largestPledge.amount}
          </h3>
          {largestPledge.message ? (
            <h4 className="pledge-body">"{largestPledge.message}"</h4>
          ) : (
            <h4 className="pledge-body">Thank You</h4>
          )}
        </div>
      );

      recentPledge = pledges[pledges.length - 1];

      recentFormattedPledge = (
        <div className="single-pledge">
          <h3 className="pledge-category">Most Recent Pledge:</h3>
          <h3 className="pledge-title">
            {recentPledge.name} pledged ${recentPledge.amount}
          </h3>
          {recentPledge.message ? (
            <h4 className="pledge-body">"{recentPledge.message}"</h4>
          ) : (
            <h4 className="pledge-body">Thank You</h4>
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
            <h3 className="pledge-instructions">Text an amount to</h3>
            <h3 className="pledge-highlight">(347) 527-4222</h3>
            <h3 className="pledge-instructions">to make a pledge</h3>
            <h3 className="pledge-instructions">Total donors: {totalDonors}</h3>
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
                18K{" "}
              </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 50 ? "tic-highlight" : "tic"}>
                {" "}
                37.5K{" "}
              </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 75 ? "tic-highlight" : "tic"}>
                {" "}
                56K{" "}
              </h3>
            </div>
            <div className="tic-container">
              <h3 className="tic"> | </h3>
              <h3 className={totalPercent >= 100 ? "tic-highlight" : "tic"}>
                {" "}
                75K{" "}
              </h3>
            </div>
          </div>
          <h3>{exceedMessage}</h3>
        </div>
      </div>
    );
  }
}

export default PledgeFront;
