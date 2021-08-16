import {
  SET_IS_HOST,
  SET_SHOW_SETTINGS
} from '../types/actions/RoomPage';
  

export const setIsHost = (value: boolean): SET_IS_HOST => {
  return {
    type: 'SET_IS_HOST',
    payload: value
  }
};


export const setShowSettings = (value: boolean): SET_SHOW_SETTINGS => {
  return {
    type: 'SET_SHOW_SETTINGS',
    payload: value
  }
};