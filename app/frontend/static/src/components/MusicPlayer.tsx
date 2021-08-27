import { FC } from 'react';
import {
  Card,
  Grid,
  IconButton,
  LinearProgress,
  Typography 
} from '@material-ui/core';
import { PlayArrow, SkipNext } from '@material-ui/icons';


const MusicPlayer: FC = (): JSX.Element => {
  return (
    <Card>
      <Grid container
        alignItems='center'
      >
        <Grid item xs={4}>
          Image
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h5'>
            Title
          </Typography>
          <Typography color='textSecondary' variant='subtitle1'>
            Artist
          </Typography>
          <div>
            <IconButton>
              <PlayArrow />
            </IconButton>
            <IconButton>
              { '0 / 0' }
              <SkipNext />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant='determinate' value={50} />
    </Card>
  );
};


export default MusicPlayer;