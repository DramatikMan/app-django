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
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <p>This is the home page</p>
        </Route>
        <Route exact path='/join' component={RoomJoinPage} />
        <Route exact path='/create' component={CreateRoomPage} />
      </Switch>
    </Router>
  );
}

render(<App />, document.getElementById('app'));