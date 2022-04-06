import { getRoomResponseData, MusicPlayerProps } from '../types';
import {
    SET_PROPS,
    SET_SHOW_SETTINGS,
    SET_SPOTIFY_AUTHENTICATED,
    SET_SONG
} from '../types/actions/RoomPage';


export const setProps = (value: getRoomResponseData): SET_PROPS => {
    return {
        type: 'SET_PROPS',
        payload: value
    }
}


export const setShowSettings = (value: boolean): SET_SHOW_SETTINGS => {
    return {
        type: 'SET_SHOW_SETTINGS',
        payload: value
    }
}


export const setSpotifyAuthenticated = (
    value: boolean
): SET_SPOTIFY_AUTHENTICATED => {
    return {
        type: 'SET_SPOTIFY_AUTHENTICATED',
        payload: value
    }
}


export const setSong = (value: MusicPlayerProps): SET_SONG => {
    return {
        type: 'SET_SONG',
        payload: value
    }
}
