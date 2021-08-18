import RoomSettingsPageState from './RoomSettingsPage';
import RoomPageState from './RoomPage';
import RoomJoinPageState from './RoomJoinPage';


export default interface GlobalState {
  RoomSettingsPage: RoomSettingsPageState;
  RoomPage: RoomPageState;
  RoomJoinPage: RoomJoinPageState;
};