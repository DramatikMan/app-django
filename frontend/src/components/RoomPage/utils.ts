import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { getRoomResp, MusicPlayerProps } from '../../types';
import { setSong } from '../../actionCreators/RoomPage';
import { RoomPageActions } from '../../types/actions/RoomPage';
import { 
    setProps,
    setShowSettings,
    setSpotifyAuthenticated
} from '../../actionCreators/RoomPage';
import { ROOM_API, SPOTIFY_API } from '../../config';



const authenticateSpotify = async (
    dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
    const resp: Response = await fetch(`${SPOTIFY_API}/auth/status`);
    const respData: { status: boolean } = await resp.json();

    if (respData.status === false) {
        const resp: Response = await fetch(`${SPOTIFY_API}/auth/url`);
        const respData: { url: string } = await resp.json();
        window.location.href = respData.url;
    } else dispatch(setSpotifyAuthenticated(true));
}


export const getRoomData = async (
    roomCode: string,
    navigate: NavigateFunction,
    dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
    const resp: Response = await fetch(`${ROOM_API}/${roomCode}`);
    if (!resp.ok) navigate('/');
    const respData: getRoomResp = await resp.json();
    dispatch(setProps(respData));
    if (respData.isHost) { await authenticateSpotify(dispatch); }
}


export const updateCallback = (
    roomCode: string,
    navigate: NavigateFunction,
    dispatch: Dispatch<RoomPageActions>
): void => {
    getRoomData(roomCode, navigate, dispatch);
    dispatch(setShowSettings(false));
}


export const leaveRoomPressed = async (
    navigate: NavigateFunction
): Promise<void> => {
    await fetch(`${ROOM_API}/leave`);
    navigate('/');
}


export const getSong = async (
    dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
    const resp: Response = await fetch(`${SPOTIFY_API}/song`);

    if (resp.ok) {
        const respData: MusicPlayerProps = await resp.json();
        dispatch(setSong(respData));
    }
}
