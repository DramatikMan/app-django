import State from '../types/state/RoomJoinPage';
import { RoomJoinPageActions } from '../types/actions/RoomJoinPage';


const initialState: State = {
};

const reducer = (
  state: State = initialState,
  action: RoomJoinPageActions
): State => {
  switch (action.type) {
    default:
      return state;
  }
};


export default reducer;