import { FC, Dispatch, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { History } from 'history';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import State from '../types/state';
import RoomSettingsPage from './RoomSettingsPage';
import { RoomPageActions } from '../types/actions/RoomPage';
import { RoomSettingsPageActions } from '../types/actions/RoomSettingsPage';
import { setShowSettings } from '../actionCreators/RoomPage';
import { setState as setSettingsState } from '../actionCreators/RoomSettingsPage';
import { leaveRoomPressed, getRoomData, updateCallback } from './utils';


type Actions = RoomPageActions | RoomSettingsPageActions;


const RoomPage: FC = (): JSX.Element => {
  const dispatch: Dispatch<Actions> = useDispatch();
  const history: History = useHistory();
  const { roomCode } = useParams<{ roomCode: string }>();

  const guestCanPause: boolean = useSelector(
    (state: State): boolean => state.RoomPage.guestCanPause
  );
  const votesToSkip: number = useSelector(
    (state: State): number => state.RoomPage.votesToSkip
  );
  const isHost: boolean = useSelector(
    (state: State): boolean => state.RoomPage.isHost
  );
  const showSettings: boolean = useSelector(
    (state: State): boolean => state.RoomPage.showSettings
  );

  useEffect(() => { getRoomData(roomCode, history, dispatch); }, []);

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

  if (showSettings) {
    dispatch(setSettingsState({
      guestCanPause: guestCanPause,
      votesToSkip: votesToSkip
    }));
    return (
      <RoomSettingsPage
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
      { isHost ? renderSettingsButton() : null }
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