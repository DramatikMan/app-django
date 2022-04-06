import ReduxAction from '.';


export interface SET_ROOM_CODE extends ReduxAction<string> {
    type: 'SET_ROOM_CODE';
}


export interface SET_HELPER_TEXT extends ReduxAction<string> {
    type: 'SET_HELPER_TEXT';
}


export type RoomJoinPageActions = SET_ROOM_CODE | SET_HELPER_TEXT;
