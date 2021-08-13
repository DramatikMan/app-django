import { StateInterface } from './interfaces';


const initialState: StateInterface = {
    RoomSettingsPage: {
        guestCanPause: false,
        votesToSkip: 2
    }
};


const reducer = (state: StateInterface = initialState) => state;


export default reducer;