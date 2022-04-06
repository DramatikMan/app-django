import State from '../types/state/RoomJoinPage';
import { RoomJoinPageActions } from '../types/actions/RoomJoinPage';


const initialState: State = {
    roomCode: '',
    helperText: ''
}

const reducer = (
    state: State = initialState,
    action: RoomJoinPageActions
): State => {
    switch (action.type) {
        case 'SET_ROOM_CODE':
            return {
                ...state,
                roomCode: action.payload
            }
        case 'SET_HELPER_TEXT':
            return {
                ...state,
                helperText: action.payload
            }
        default:
            return state;
    }
}


export default reducer;
