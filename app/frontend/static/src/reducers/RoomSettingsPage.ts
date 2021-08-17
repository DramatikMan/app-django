import State from '../types/state/RoomSettingsPage';
import { RoomSettingsPageActions } from '../types/actions/RoomSettingsPage';


const initialState: State= {
  guestCanPause: false,
  votesToSkip: 2,
  isUpdate: false
};

const reducer = (
  state: State = initialState,
  action: RoomSettingsPageActions
): State => {
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
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
};


export default reducer;