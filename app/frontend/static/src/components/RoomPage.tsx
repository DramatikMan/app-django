import { FC, Dispatch, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { History } from 'history';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import State from '../types/state';
import { leaveRoomPressed, getRoomData } from './utils';
import { RoomPageActions } from '../types/actions/RoomPage';

const RoomPage: FC = (): JSX.Element => {
  const dispatch: Dispatch<RoomPageActions> = useDispatch();
  const history: History = useHistory();
  const { roomCode } = useParams<{ roomCode: string }>();

  const isHost: boolean = useSelector(
    (state: State): boolean =>
    state.RoomPage.isHost
  );
  // const showSettings: boolean = useSelector(
  //   (state: State): boolean =>
  //   state.RoomPage.showSettings
  // );

  useEffect(() => { getRoomData(roomCode, history, dispatch); }, []);

  const renderSettingsButton = (): JSX.Element => {
    return (
      <Grid item xs={12}>
        <Button variant='contained' color='primary'>
          Settings
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '90vh' }}
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