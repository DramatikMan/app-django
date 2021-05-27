import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HomePage from "./HomePage";
import RoomSettingsPage from "./RoomSettingsPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import About from "./About";


const App = () => {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/create" component={RoomSettingsPage} />
          <Route exact path="/join" component={RoomJoinPage} />
          <Route exact path="/room/:roomCode" component={Room} />
          <Route exact path="/about" component={About} />
      </Switch>
    </Router>
  );
}

render(<App />, document.getElementById("app"));