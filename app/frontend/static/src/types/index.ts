import { Dispatch } from 'react';
import { RoomPageActions } from './actions/RoomPage';
import { History } from 'history';


export interface postRoomResponseData {
    code: string;
  };
  
  
export interface getRoomResponseData {
  guestCanPause: boolean;
  votesToSkip: number;
  isHost: boolean;
};


export interface RoomSettingsPageProps {
  updateCallback(
    roomCode: string,
    history: History,
    dispatch: Dispatch<RoomPageActions>
  ): void;
}