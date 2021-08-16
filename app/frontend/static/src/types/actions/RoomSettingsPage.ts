import ReduxAction from '.';


export interface SET_GUEST_CAN_PAUSE
extends ReduxAction<boolean> {
  type: 'SET_GUEST_CAN_PAUSE';
};


export interface SET_VOTES_TO_SKIP
extends ReduxAction<number> {
  type: 'SET_VOTES_TO_SKIP';
};


export type RoomSettingsPageActions = SET_GUEST_CAN_PAUSE | SET_VOTES_TO_SKIP;