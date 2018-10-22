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
        <h1> PURSUIT BASH </h1>

        <h3> Welcome to the celebration </h3>

        <Line
          className="the-bar"
          percent={((total / 1000) * 100).toString()}
          strokeWidth="4"
          strokeColor="#1E1E1E"
          strokeLinecap="butt"
          trailColor="#E3E3E3"
          trailWidth="2"
        />
      </div>
    );
  }
}

export default App;
