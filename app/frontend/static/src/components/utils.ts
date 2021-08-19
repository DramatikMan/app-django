import { Dispatch } from 'react';
import { History } from 'history';

import {
  postRoomResponseData,
  getRoomResponseData
} from '../types';
import { RoomPageActions } from '../types/actions/RoomPage';
import { setProps, setShowSettings } from '../actionCreators/RoomPage';
import { RoomJoinPageActions } from '../types/actions/RoomJoinPage';
import { setHelperText } from '../actionCreators/RoomJoinPage';


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