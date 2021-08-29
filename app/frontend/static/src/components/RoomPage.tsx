import { FC, Dispatch, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { History } from 'history';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import GlobalState from '../types/state';
import State from '../types/state/RoomPage';
import RoomSettingsPage from './RoomSettingsPage';
import MusicPlayer from './MusicPlayer';
import { RoomPageActions } from '../types/actions/RoomPage';
import { RoomSettingsPageActions } from '../types/actions/RoomSettingsPage';
import { setShowSettings } from '../actionCreators/RoomPage';
import {
  leaveRoomPressed,
  getRoomData,
  updateCallback,
  getSong
} from './utils';


type Actions = RoomPageActions | RoomSettingsPageActions;


const RoomPage: FC = (): JSX.Element => {
  const dispatch: Dispatch<Actions> = useDispatch();
  const history: History = useHistory();
  const { roomCode } = useParams<{ roomCode: string }>();
  const state: State = useSelector((state: GlobalState) => state.RoomPage);

  useEffect(() => { getRoomData(roomCode, history, dispatch); }, []);
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
  };

  if (state.showSettings) {
    return (
      <RoomSettingsPage
        guestCanPause={state.guestCanPause}
        votesToSkip={state.votesToSkip}
        isUpdate={true}
        updateCallback={updateCallback}
      />
    );
  };

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
          onClick={ () => leaveRoomPressed(history) }
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};


export default RoomPage;