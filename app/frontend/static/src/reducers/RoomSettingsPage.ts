import StateInterface from '../types/state/RoomSettingsPage';
import { RoomSettingsPageActions } from '../types/actions/RoomSettingsPage';


const initialState: StateInterface= {
  guestCanPause: false,
  votesToSkip: 2
};

const reducer = (
  state: StateInterface = initialState,
  action: RoomSettingsPageActions
): StateInterface => {
  switch (action.type) {
    case 'SET_GUEST_CAN_PAUSE':
      return {
        ...state,
        guestCanPause: action.payload
      };
    case 'SET_VOTES_TO_SKIP':
      return {
        ...state,
        votesToSkip: action.payload
      };
    default:
      return state;
  }
};


export default reducer;