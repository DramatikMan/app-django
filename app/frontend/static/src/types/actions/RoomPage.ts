import ReduxAction from '.';
import { getRoomResponseData } from '..';


export interface SET_PROPS
extends ReduxAction<getRoomResponseData> {
  type: 'SET_PROPS';
};


export interface SET_SHOW_SETTINGS
extends ReduxAction<boolean> {
  type: 'SET_SHOW_SETTINGS';
};


export type RoomPageActions = SET_PROPS | SET_SHOW_SETTINGS;