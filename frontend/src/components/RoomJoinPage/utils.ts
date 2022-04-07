import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { RoomJoinPageActions } from '../../types/actions/RoomJoinPage';
import { setHelperText } from '../../actionCreators/RoomJoinPage';

import { ROOM_API } from '../../config'


export const enterRoomPressed = async (
    roomCode: string,
    navigate: NavigateFunction,
    dispatch: Dispatch<RoomJoinPageActions>
): Promise<void> => {
    const requestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: roomCode })
    }
    const resp: Response = await fetch(`${ROOM_API}/join`, requestInit);
    if (resp.ok) navigate(`/room/${roomCode}`);
    else dispatch(setHelperText('Room not found'));
}
