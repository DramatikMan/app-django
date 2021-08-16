import { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { History } from 'history';
import { Grid, Typography, Button } from '@material-ui/core';
// import { useSelector } from 'react-redux';

// import State from '../types/state';
import { leaveRoomPressed } from './utils';

const RoomPage: FC = (): JSX.Element => {
  const history: History = useHistory();
  const { roomCode } = useParams<{ roomCode: string }>();

  // const isHost: boolean = useSelector(
  //   (state: State): boolean =>
  //   state.RoomPage.isHost
  // );
  // const showSettings: boolean = useSelector(
  //   (state: State): boolean =>
  //   state.RoomPage.showSettings
  // );

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