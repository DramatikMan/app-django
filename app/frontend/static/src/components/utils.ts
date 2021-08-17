import { Dispatch } from 'react';
import { History } from 'history';

import {
  postRoomResponseData,
  getRoomResponseData
} from '../types';
import { RoomPageActions } from '../types/actions/RoomPage';
import { setProps } from '../actionCreators/RoomPage';


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
  const requestInit = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  await fetch('/api/room/leave', requestInit);
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