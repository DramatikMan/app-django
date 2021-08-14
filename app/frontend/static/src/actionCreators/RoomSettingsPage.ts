import {
  SET_GUEST_CAN_PAUSE,
  SET_VOTES_TO_SKIP
} from '../types/actions/RoomSettingsPage';


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