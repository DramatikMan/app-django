import { NavigateFunction } from 'react-router-dom';

import { API } from '../../config';


export const checkUserInRoom = async (
    navigate: NavigateFunction
): Promise<void> => {
    const resp: Response = await fetch(`${API}/user-in-room`);
    const respData: { roomCode: string | null } = await resp.json();
    if (!(respData.roomCode === null)) navigate(`/room/${respData.roomCode}`);
}
