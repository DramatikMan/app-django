import { FC } from 'react';
import {
  Card,
  Grid,
  IconButton,
  LinearProgress,
  Typography 
} from '@material-ui/core';
import { Pause, PlayArrow, SkipNext } from '@material-ui/icons';

import { MusicPlayerProps } from '../types';


const MusicPlayer: FC<MusicPlayerProps> = (
  props: MusicPlayerProps
): JSX.Element => {
  const songProgress: number = props.progress / props.duration * 100;

  return (
    <Card>
      <Grid container item
        alignItems='center'
      >
        <Grid item xs={4}>
          <img src={props.image_url} height='100%' width='100%' />
        </Grid>
        <Grid container item xs={8}
          direction='column'
          alignItems='center'
          justifyContent='center'
        >
          <Typography variant='h5' align='center'>
            {props.title}
          </Typography>
          <Typography color='textSecondary' variant='subtitle1' align='center'>
            {props.artist}
          </Typography>
          <div>
            <IconButton>
              { props.is_playing ? <Pause /> : <PlayArrow /> }
            </IconButton>
            <IconButton>
              {props.votes}{ ' / ' }{props.votes_required}
              <SkipNext />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant='determinate' value={songProgress} />
    </Card>
  );
};


export default MusicPlayer;