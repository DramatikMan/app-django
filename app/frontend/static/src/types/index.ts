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
  guestCanPause: boolean;
  votesToSkip: number;
  isUpdate: boolean;
  updateCallback(
    roomCode: string,
    history: History,
    dispatch: Dispatch<RoomPageActions>
  ): void;
};


export interface MusicPlayerProps {
  title: string;
  artist: string;
  duration: number;
  progress: number;
  image_url: string;
  is_playing: boolean;
  votes: number;
  votes_required: number;
  id: string;
};