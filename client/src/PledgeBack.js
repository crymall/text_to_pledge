import React, { Component } from "react";
import axios from "axios";

class PledgeBack extends Component {
  constructor() {
    super();
    this.state = {
      steps: 0,
      msg: ""
    };
  }
  sendBlast = () => {
    if (this.state.steps === 1) {
      axios
        .get("/blast")
        .then(() => {
          this.setState({
            steps: 0,
            msg: "Message Sent"
          });
        })
        .catch(err => {
          this.setState({
            msg: err
          });
        });
    } else {
      this.setState({
        steps: 1,
        msg: "Are you sure? Press again to confirm."
      });
    }
  };

  render() {
    return (
      <div className="backend-area">
        <button className="send-button" onClick={this.sendBlast}>
          SEND MESSAGE
        </button>
        <h3>{this.state.msg}</h3>
      </div>
    );
  }
}

export default PledgeBack;
