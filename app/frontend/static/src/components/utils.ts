import { History } from 'history';

import { postRoomRespDataInterface } from '../types/respData';


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
  const resp: Response = await fetch('/api/create-room', requestInit);

  if (resp.ok) {
    const respData: postRoomRespDataInterface = await resp.json();
    history.push('/room/' + respData.code);
  }
};