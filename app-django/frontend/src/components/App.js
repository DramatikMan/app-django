import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";


function App() {
  return (
    <div>
      <HomePage />
      <CreateRoomPage />
      <RoomJoinPage />
    </div>
  );
}

render(<App />, document.getElementById('app'));