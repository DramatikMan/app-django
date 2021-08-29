import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';


const About: FC = (): JSX.Element => {
  return (
    <Grid container
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '90vh', width: '100%', margin: 0 }}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant='body1' align='center'>
          This app allows you to host or join rooms to control host's Spotify playback.
        </Typography>
        <Typography variant='body1' align='center'>
          Room host needs to start playing something from their Spotify account for this to work.
        </Typography>
        <Typography variant='body1' align='center'>
          Also host's Spotify account has to have Premium. Their rules, not mine ¯\_(ツ)_/¯ .
        </Typography>
      </Grid>
      <Grid item xs={12}>
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