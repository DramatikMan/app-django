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
import { GlobalStateInterface as StateInterface } from '../types/state';
import { SET_GUEST_CAN_PAUSE } from '../types/actions';


const RoomSettingsPage: FC = (): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();
  
  const guestCanPause: boolean = useSelector(
    (state: StateInterface): boolean =>
    state.RoomSettingsPage.guestCanPause
  );
  const votesToSkip: number = useSelector(
    (state: StateInterface): number =>
    state.RoomSettingsPage.votesToSkip
  );

  const setGuestCanPause = (value: string): void => {
    const action: SET_GUEST_CAN_PAUSE = {
      type: 'SET_GUEST_CAN_PAUSE',
      payload: value === 'true'
    };
    dispatch(action);
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
        <Typography variant='h4'>
          Create a Room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormHelperText style={{ textAlign: 'center' }}>
            Guest control of playback state
          </FormHelperText>
          <RadioGroup row
            value={String(guestCanPause)}
            onChange={e => setGuestCanPause(e.target.value)}
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
          />
          <FormHelperText style={{ textAlign: 'center' }}>
            Votes required to skip a song
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button color='primary' variant='contained'>
          Placeholder
        </Button>
      </Grid>
    </Grid>
  );
};


export default RoomSettingsPage;