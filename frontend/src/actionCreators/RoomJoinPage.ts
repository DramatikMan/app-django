import { SET_ROOM_CODE, SET_HELPER_TEXT } from '../types/actions/RoomJoinPage';


export const setRoomCode = (value: string): SET_ROOM_CODE => {
    return {
        type: 'SET_ROOM_CODE',
        payload: value
    }
}


export const setHelperText = (value: string): SET_HELPER_TEXT => {
    return {
        type: 'SET_HELPER_TEXT',
        payload: value
    }
}
