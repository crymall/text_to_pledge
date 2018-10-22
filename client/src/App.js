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
    const copyMessages = [
      "Welcome to the \n celebration.",
      "We're happy \n to see you here.",
      "Help support another year \n of transformation.",
      "Own your pursuit - \n and help others own theirs.",
      "Help this to be \n a night to remember."
    ];
    const copyMessage =
      copyMessages[Math.floor(Math.random() * copyMessages.length)];
    let totalPercent;
    let exceedMessage;

    if (total >= goal) {
      totalPercent = 100;
      exceedMessage = `Total raised: $${total} !`;
    } else {
      totalPercent = (total / goal) * 100;
    }

    let singlePledge;
    let displayPledge;

    if (pledges.length) {
      singlePledge = pledges[Math.floor(Math.random() * pledges.length)];

      displayPledge = (
        <div className="single-pledge">
          <h3 className="pledge-title">
            {singlePledge.name} donated ${singlePledge.amount}
          </h3>
          <h4 className="pledge-body">"{singlePledge.message}"</h4>
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
            <h3> {copyMessage} </h3>
          </div>
          <div className="donation-area">{displayPledge}</div>
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
