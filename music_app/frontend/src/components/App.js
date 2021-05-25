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


const App = () => {
  return (
    <Router basename="/music_app">
      <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/create" component={RoomSettingsPage} />
          <Route exact path="/join" component={RoomJoinPage} />
          <Route exact path="/room/:roomCode" component={Room} />
      </Switch>
    </Router>
  );
}

render(<App />, document.getElementById("app"));