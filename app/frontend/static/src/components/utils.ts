import { Dispatch } from 'react';
import { History } from 'history';

import {
  postRoomResponseData,
  getRoomResponseData
} from '../types';
import { RoomPageActions } from '../types/actions/RoomPage';
import { setProps, setShowSettings, setSong, setSpotifyAuthenticated } from '../actionCreators/RoomPage';
import { RoomJoinPageActions } from '../types/actions/RoomJoinPage';
import { setHelperText } from '../actionCreators/RoomJoinPage';
import { MusicPlayerProps } from '../types';


export const createRoomPressed = async (
  guestCanPause: boolean,
  votesToSkip: number,
  history: History
): Promise<void> => {
  const requestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      guestCanPause: guestCanPause,
      votesToSkip: votesToSkip
    })
  };
  const resp: Response = await fetch('/api/room', requestInit);

  if (resp.ok) {
    const respData: postRoomResponseData = await resp.json();
    history.push('/room/' + respData.code);
  }
};


export const leaveRoomPressed = async (history: History): Promise<void> => {
  await fetch('/api/room/leave');
  history.push('/');
};


export const getRoomData = async (
  roomCode: string,
  history: History,
  dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
  const resp: Response = await fetch('/api/room/' + roomCode);
  if (!resp.ok) history.push('/');
  const respData: getRoomResponseData = await resp.json();
  dispatch(setProps(respData));
  if (respData.isHost) { await authenticateSpotify(dispatch); };
};


export const updateRoomPressed = async (
  guestCanPause: boolean,
  votesToSkip: number,
  roomCode: string
): Promise<void> => {
  const requestInit = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      guestCanPause: guestCanPause,
      votesToSkip: votesToSkip
    })
  };
  await fetch('/api/room/' + roomCode, requestInit);
};


export const updateCallback = (
  roomCode: string,
  history: History,
  dispatch: Dispatch<RoomPageActions>
): void => {
  getRoomData(roomCode, history, dispatch);
  dispatch(setShowSettings(false));
};


export const enterRoomPressed = async (
  roomCode: string,
  history: History,
  dispatch: Dispatch<RoomJoinPageActions>
): Promise<void> => {
  const requestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomCode: roomCode })
  };
  const resp: Response = await fetch('/api/room/join', requestInit);
  if (resp.ok) history.push('/room/' + roomCode);
  else dispatch(setHelperText('Room not found'));
};


export const checkUserInRoom = async (history: History): Promise<void> => {
  const resp: Response = await fetch('/api/user-in-room');
  const respData: { room_code: string | null } = await resp.json();
  if (respData.room_code) history.push('/room/' + respData.room_code);
};


export const authenticateSpotify = async (
  dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
  const resp: Response = await fetch('/spotify/auth/status');
  const respData: { status: boolean } = await resp.json();

  if (respData.status === false) {
    const resp: Response = await fetch('/spotify/auth/url');
    const respData: { url: string } = await resp.json();
    window.location.href = respData.url;
  }
  else dispatch(setSpotifyAuthenticated(true));
};


export const getSong = async (
  dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
  const resp: Response = await fetch('/spotify/song');
  if (resp.ok) {
    const respData: MusicPlayerProps = await resp.json();
    dispatch(setSong(respData));
  };
};


export const pauseSong = async (): Promise<void> => {
  const requestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  };
  await fetch('/spotify/pause', requestInit);
};


export const playSong = async (): Promise<void> => {
  const requestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  };
  await fetch('/spotify/play', requestInit);
};