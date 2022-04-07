import { FC, Dispatch, useEffect } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import {
    getRoomData,
    getSong,
    leaveRoomPressed,
    updateCallback
} from './utils';
import GlobalState from '../../types/state';
import State from '../../types/state/RoomPage';
import RoomSettingsPage from '../RoomSettingsPage';
import MusicPlayer from '../MusicPlayer';
import { RoomPageActions } from '../../types/actions/RoomPage';
import { RoomSettingsPageActions } from '../../types/actions/RoomSettingsPage';
import { setShowSettings } from '../../actionCreators/RoomPage';


type Actions = RoomPageActions | RoomSettingsPageActions;


const RoomPage: FC = (): JSX.Element => {
    const state: State = useSelector((state: GlobalState) => state.RoomPage);
    const dispatch: Dispatch<Actions> = useDispatch();
    const navigate: NavigateFunction = useNavigate();

    // ! using type assertion since useParams() returns path parameter fields
    // ! as possibly undefined as of react-router-dom@6.3.0 ¯\_(ツ)_/¯
    const { roomCode } = useParams<{
        roomCode: string
    }>() as { roomCode: string };

    useEffect(() => { getRoomData(roomCode, navigate, dispatch); }, []);
    useEffect(() => {
        const interval = setInterval(() => { getSong(dispatch); }, 1000);
        return () => clearInterval(interval);
    }, []);

    const renderSettingsButton = (): JSX.Element => {
        return (
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={ () => dispatch(setShowSettings(true)) }
                >
                    Settings
                </Button>
            </Grid>
        );
    }

    if (state.showSettings) {
        return (
            <RoomSettingsPage
                guestCanPause={state.guestCanPause}
                votesToSkip={state.votesToSkip}
                isUpdate={true}
                updateCallback={updateCallback}
            />
        );
    }

    return (
        <Grid container
            direction='column'
            alignItems='center'
            justifyContent='center'
            style={{ minHeight: '90vh', width: '100%', margin: 0 }}
            spacing={1}
        >
            <Grid item xs={12}>
                <Typography variant='h6'>
                    Room Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...state.song} />
            { state.isHost ? renderSettingsButton() : null }
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={ () => leaveRoomPressed(navigate) }
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
}


export default RoomPage;
