import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { FC } from 'react';
import { Link } from 'react-router-dom';


const RoomJoinPage: FC = (): JSX.Element => {
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
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Code'
          placeholder='Enter Room code'
          helperText=''
          variant='outlined'
          onChange={ () => {} }
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant='contained'
          color='primary'
          onClick={ () => {} }
        >
          Enter Room
        </Button>
      </Grid>
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
    </Grid>
  );
};


export default RoomJoinPage;