import State from '../types/state/RoomPage';
import { RoomPageActions } from '../types/actions/RoomPage';


const initialState: State = {
  guestCanPause: false,
  votesToSkip: 2,
  isHost: false,
  showSettings: false,
  spotifyAuthenticated: false,
  song: {
    title: '',
    artist: '',
    duration: NaN,
    progress: NaN,
    image_url: '',
    is_playing: false,
    votes: 0,
    votes_required: 0,
    id: ''
  }
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
    case 'SET_SPOTIFY_AUTHENTICATED':
      return {
        ...state,
        spotifyAuthenticated: action.payload
      };
    case 'SET_SONG':
      return {
        ...state,
        song: action.payload
      };
    default:
      return state;
  }
};


export default reducer;