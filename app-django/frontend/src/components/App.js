import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom"

import HomePage from "./HomePage";
import RoomCreatePage from "./RoomCreatePage";
import RoomJoinPage from "./RoomJoinPage";


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/create" component={RoomCreatePage} />
        <Route exact path="/join" component={RoomJoinPage} />
      </Switch>
    </Router>
  );
}

render(<App />, document.getElementById("app"));