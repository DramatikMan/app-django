import { NavigateFunction } from 'react-router-dom';

import { postRoomResp } from '../../types';
import { ROOM_API } from '../../config';


export const createRoomPressed = async (
    guestCanPause: boolean,
    votesToSkip: number,
    navigate: NavigateFunction
): Promise<void> => {
    const requestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            guestCanPause: guestCanPause,
            votesToSkip: votesToSkip
        })
    }
    const resp: Response = await fetch(`${ROOM_API}/`, requestInit);

    if (resp.ok) {
        const respData: postRoomResp = await resp.json();
        navigate(`/room/${respData.roomCode}`);
    }
}


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
    }
    await fetch(`${ROOM_API}/${roomCode}`, requestInit);
}
