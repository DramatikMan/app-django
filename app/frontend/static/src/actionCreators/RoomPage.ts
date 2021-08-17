import { getRoomResponseData } from '../types';
import {
  SET_PROPS,
  SET_SHOW_SETTINGS
} from '../types/actions/RoomPage';


export const setProps = (value: getRoomResponseData): SET_PROPS => {
  return {
    type: 'SET_PROPS',
    payload: value
  }
};


export const setShowSettings = (value: boolean): SET_SHOW_SETTINGS => {
  return {
    type: 'SET_SHOW_SETTINGS',
    payload: value
  }
};