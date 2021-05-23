import React from "react";
import {
    Grid,
    Typography, 
    Card,
    IconButton,
    LinearProgress
} from "@material-ui/core";
import { PlayArrowIcon, SkipNextIcon, PauseIcon } from "@material-ui/icons";


export default function MusicPlayer(props) {
    const songProgress = (props.time / props.duration) * 100;

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item xs={4}>
                    <img src={props.image_url} heigth="100%" width="100%" />
                </Grid>
                <Grid item xs={8}>
                    <Typography component="h5" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {props.artist}
                    </Typography>
                    <div>
                        <IconButton>
                            { props.is_playing ? <PauseIcon /> : <PlayArrowIcon /> }
                        </IconButton>
                        <IconButton>
                            <SkipNextIcon />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}