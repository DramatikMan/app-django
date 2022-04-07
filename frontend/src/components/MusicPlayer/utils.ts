import { SPOTIFY_API } from '../../config';


export const pauseSong = async (): Promise<void> => {
    const requestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch(`${SPOTIFY_API}/pause`, requestInit);
}


export const playSong = async (): Promise<void> => {
    const requestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch(`${SPOTIFY_API}/play`, requestInit);
}


export const skipSong = async (): Promise<void> => {
    const requestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch(`${SPOTIFY_API}/skip`, requestInit);
}
