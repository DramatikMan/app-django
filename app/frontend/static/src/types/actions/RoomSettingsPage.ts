import ActionInterface from '.';


export interface SET_GUEST_CAN_PAUSE
extends ActionInterface<boolean> {
  type: 'SET_GUEST_CAN_PAUSE'
};


export interface SET_VOTES_TO_SKIP
extends ActionInterface<number> {
  type: 'SET_VOTES_TO_SKIP'
};


export type RoomSettingsPageActions = SET_GUEST_CAN_PAUSE | SET_VOTES_TO_SKIP;