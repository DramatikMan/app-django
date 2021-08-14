import {
  SET_GUEST_CAN_PAUSE,
  SET_VOTES_TO_SKIP
} from '../types/actions/RoomSettingsPage';


export const setGuestCanPause = (value: boolean): SET_GUEST_CAN_PAUSE => {
  return {
    type: 'SET_GUEST_CAN_PAUSE',
    payload: value
  }
};


export const setVotesToSkip = (value: number): SET_VOTES_TO_SKIP => {
  return {
    type: 'SET_VOTES_TO_SKIP',
    payload: value
  }
};