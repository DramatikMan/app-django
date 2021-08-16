import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';


const About: FC = (): JSX.Element => {
  return (
    <Grid container
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '90vh' }}
      spacing={3}
    >
      <Grid item>
        <Typography variant='body1'>
          This app allows you to host or join rooms to control the host's Spotify playback.
        </Typography>
        <Typography variant='body1'>
          The host needs to start playing something from their Spotify account for this to work.
        </Typography>
        <Typography variant='body1'>
          Also the host's Spotify account has to have Premium. Their rules, not mine ¯\_(ツ)_/¯ .
        </Typography>
      </Grid>
      <Grid item>
        <Button
          color='secondary'
          variant='contained'
          component={Link}
          to='/' 
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
}


export default About;