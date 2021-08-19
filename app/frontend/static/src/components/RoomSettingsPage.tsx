import { FC, Dispatch } from 'react';
import {
  TextField,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormHelperText,
  FormControl,
  Grid,
  Typography
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { History } from 'history';

import { RoomSettingsPageProps as Props } from '../types';
import State from '../types/state';
import { RoomPageActions } from '../types/actions/RoomPage';
import { RoomSettingsPageActions } from '../types/actions/RoomSettingsPage';
import {
  setGuestCanPause,
  setVotesToSkip
} from '../actionCreators/RoomSettingsPage';
import { createRoomPressed, updateRoomPressed } from './utils';


type Actions = RoomPageActions | RoomSettingsPageActions;


const RoomSettingsPage: FC<Props>= (props: Props): JSX.Element => {
  const dispatch: Dispatch<Actions> = useDispatch();
  const history: History = useHistory();
  const { roomCode } = useParams<{ roomCode: string }>();
  
  const guestCanPause: boolean = useSelector(
    (state: State): boolean => state.RoomSettingsPage.guestCanPause
  );
  const votesToSkip: number = useSelector(
    (state: State): number => state.RoomSettingsPage.votesToSkip
  );
  const isUpdate: boolean = useSelector(
    (state: State): boolean => state.RoomSettingsPage.isUpdate
  );

  const renderBackButton = (): JSX.Element => {
    if (isUpdate) {
      return (
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='secondary'
            onClick={ () => props.updateCallback(roomCode, history, dispatch) }
          >
            Close settings
          </Button>
        </Grid>
      );
    }
    else {
      return (
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to='/'
          >
            Back
          </Button>
        </Grid>
      );
    };
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
        <Typography variant='h4'>
          { isUpdate ? 'Update Room': 'Create a Room'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormHelperText style={{ textAlign: 'center' }}>
            Guest control of playback state
          </FormHelperText>
          <RadioGroup row
            value={String(guestCanPause)}
            onChange={ e => dispatch(setGuestCanPause(e.target.value)) }
          >
            <FormControlLabel
              value='true'
              control={ <Radio color='primary' /> }
              label='Play / pause'
              labelPlacement='bottom'
            />
            <FormControlLabel
              value='false'
              control={ <Radio color='secondary' /> }
              label='No control'
              labelPlacement='bottom'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <TextField
            required={true}
            defaultValue={votesToSkip}
            inputProps={{ style: { textAlign: 'center' } }}
            onChange={ e => dispatch(setVotesToSkip(e.target.value))}
          />
          <FormHelperText style={{ textAlign: 'center' }}>
            Votes required to skip a song
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          color='primary'
          variant='contained'
          onClick={
            isUpdate
            ? () => updateRoomPressed(guestCanPause, votesToSkip, roomCode)
            : () => createRoomPressed(guestCanPause, votesToSkip, history)
          }
        >
          { isUpdate ? 'Update Room' : 'Сreate a Room' }
        </Button>
      </Grid>
      { renderBackButton() }
    </Grid>
  );
};


export default RoomSettingsPage;