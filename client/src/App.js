import React, { Component } from "react";
import axios from "axios";
import wordmark from "./assets/wordmark.png";
import { Line } from "rc-progress";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      total: 0
    };
  }

  componentDidMount() {
    axios.get("/total").then(res => {
      this.setState({
        total: res.data.total.sum
      });
    });
  }

  render() {
    const { total } = this.state;
    return (
      <div className="App">
        <div className="header-area">
          <h1> PURSUIT BASH </h1>
        </div>

        <div className="main-area">
          <div className="content-area">
            <h3> Welcome to the celebration </h3>
          </div>
          <div className="donation-area" />
        </div>

        <div className="lower-area">
          <Line
            className="the-bar"
            percent={((total / 1000) * 100).toString()}
            strokeWidth="0.5"
            strokeColor="#1E1E1E"
            strokeLinecap="butt"
            trailColor="#E3E3E3"
            trailWidth="0.2"
          />
          <div className="bar-tics">
            <div className="tic">
              <h3> | </h3>
              <h3> 0 </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 250 </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 500 </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 750 </h3>
            </div>
            <div className="tic">
              <h3> | </h3>
              <h3> 1K </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
