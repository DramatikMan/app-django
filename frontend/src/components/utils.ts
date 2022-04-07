import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { postRoomResponseData, getRoomResponseData } from '../types';
import { RoomPageActions } from '../types/actions/RoomPage';
import { 
    setProps,
    setShowSettings,
    setSong,
    setSpotifyAuthenticated
} from '../actionCreators/RoomPage';
import { RoomJoinPageActions } from '../types/actions/RoomJoinPage';
import { setHelperText } from '../actionCreators/RoomJoinPage';
import { API_PREFIX } from '../config';
import { MusicPlayerProps } from '../types';


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
    const resp: Response = await fetch(API_PREFIX + '/room', requestInit);

    if (resp.ok) {
        const respData: postRoomResponseData = await resp.json();
        navigate('/room/' + respData.code);
    }
}


export const leaveRoomPressed = async (
    navigate: NavigateFunction
): Promise<void> => {
    await fetch(API_PREFIX + '/room/leave');
    navigate('/');
}


const authenticateSpotify = async (
    dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
    const resp: Response = await fetch(API_PREFIX + '/spotify/auth/status');
    const respData: { status: boolean } = await resp.json();

    if (respData.status === false) {
        const resp: Response = await fetch(API_PREFIX + '/spotify/auth/url');
        const respData: { url: string } = await resp.json();
        window.location.href = respData.url;
    } else dispatch(setSpotifyAuthenticated(true));
}


export const getRoomData = async (
    roomCode: string,
    navigate: NavigateFunction,
    dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
    const resp: Response = await fetch(API_PREFIX + '/room/' + roomCode);
    if (!resp.ok) navigate('/');
    const respData: getRoomResponseData = await resp.json();
    dispatch(setProps(respData));
    if (respData.isHost) { await authenticateSpotify(dispatch); }
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
    await fetch(API_PREFIX + '/room/' + roomCode, requestInit);
}


export const updateCallback = (
    roomCode: string,
    navigate: NavigateFunction,
    dispatch: Dispatch<RoomPageActions>
): void => {
    getRoomData(roomCode, navigate, dispatch);
    dispatch(setShowSettings(false));
}


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
    const resp: Response = await fetch(API_PREFIX + '/room/join', requestInit);
    if (resp.ok) navigate('/room/' + roomCode);
    else dispatch(setHelperText('Room not found'));
}


export const checkUserInRoom = async (
    navigate: NavigateFunction
): Promise<void> => {
    const resp: Response = await fetch(API_PREFIX + '/user-in-room');
    const respData: { room_code: string | null } = await resp.json();
    if (!(respData.room_code === null)) navigate('/room/' + respData.room_code);
}


export const getSong = async (
    dispatch: Dispatch<RoomPageActions>
): Promise<void> => {
    const resp: Response = await fetch(API_PREFIX + '/spotify/song');
    if (resp.ok) {
        const respData: MusicPlayerProps = await resp.json();
        dispatch(setSong(respData));
    }
}


export const pauseSong = async (): Promise<void> => {
    const requestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch(API_PREFIX + '/spotify/pause', requestInit);
}


export const playSong = async (): Promise<void> => {
    const requestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch(API_PREFIX + '/spotify/play', requestInit);
}


export const skipSong = async (): Promise<void> => {
    const requestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch(API_PREFIX + '/spotify/skip', requestInit);
}
