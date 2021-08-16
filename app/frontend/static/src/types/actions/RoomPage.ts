import ReduxAction from '.';


export interface SET_IS_HOST
extends ReduxAction<boolean> {
  type: 'SET_IS_HOST';
};


export interface SET_SHOW_SETTINGS
extends ReduxAction<boolean> {
  type: 'SET_SHOW_SETTINGS';
};


export type RoomPageActions = SET_IS_HOST | SET_SHOW_SETTINGS;