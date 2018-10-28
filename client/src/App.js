import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PledgeFront from "./PledgeFront";
import PledgeBack from "./PledgeBack";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={PledgeFront} />
        <Route exact path="/backend" component={PledgeBack} />
      </Switch>
    );
  }
}

export default App;
