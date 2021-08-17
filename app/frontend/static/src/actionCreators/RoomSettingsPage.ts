import {
  SET_GUEST_CAN_PAUSE,
  SET_VOTES_TO_SKIP,
  SET_STATE
} from '../types/actions/RoomSettingsPage';
import RoomSettingsPageState from '../types/state/RoomSettingsPage';


export const setGuestCanPause = (value: string): SET_GUEST_CAN_PAUSE => {
  return {
    type: 'SET_GUEST_CAN_PAUSE',
    payload: value === 'true'
  }
};


export const setVotesToSkip = (value: string): SET_VOTES_TO_SKIP => {
  return {
    type: 'SET_VOTES_TO_SKIP',
    payload: parseInt(value)
  }
};


export const setState = (value: RoomSettingsPageState): SET_STATE => {
  return {
    type: 'SET_STATE',
    payload: value
  }
};