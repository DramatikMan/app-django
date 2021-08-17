import State from '../types/state/RoomPage';
import { RoomPageActions } from '../types/actions/RoomPage';


const initialState: State = {
  guestCanPause: false,
  votesToSkip: 2,
  isHost: false,
  showSettings: false
};

const reducer = (
  state: State = initialState,
  action: RoomPageActions
): State => {
  switch (action.type) {
    case 'SET_PROPS': 
      return {
        ...state,
        guestCanPause: action.payload.guestCanPause,
        votesToSkip: action.payload.votesToSkip,
        isHost: action.payload.isHost
      };
    case 'SET_SHOW_SETTINGS':
      return {
        ...state,
        showSettings: action.payload
      };
    default:
      return state;
  }
};


export default reducer;