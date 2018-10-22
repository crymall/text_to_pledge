import React, { Component } from "react";
import axios from "axios";
import wordmark from "./assets/wordmark.png";
import "./App.css";

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    // axios.get("/").then(res => {
    //   console.log(res);
    // });
  }

  render() {
    return (
      <div className="App">
        <h1>PURSUIT BASH</h1>
      </div>
    );
  }
}

export default App;
