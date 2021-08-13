import { RoomSettingsInterface as StateInterface } from '../types/state';
import { SET_GUEST_CAN_PAUSE } from '../types/actions';


const initialState: StateInterface= {
  guestCanPause: false,
  votesToSkip: 2
};

const reducer = (
  state: StateInterface = initialState,
  action: SET_GUEST_CAN_PAUSE
): StateInterface => {
  switch (action.type) {
    case 'SET_GUEST_CAN_PAUSE':
      return {
        ...state,
        guestCanPause: action.payload
      };
    default:
      return {...state};
  }
};


export default reducer;