import State from '../types/state/RoomPage';
import { RoomPageActions } from '../types/actions/RoomPage';


const initialState: State = {
  isHost: false,
  showSettings: false
};

const reducer = (
  state: State = initialState,
  action: RoomPageActions
): State => {
  switch (action.type) {
    case 'SET_IS_HOST':
      return {
        ...state,
        isHost: action.payload
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