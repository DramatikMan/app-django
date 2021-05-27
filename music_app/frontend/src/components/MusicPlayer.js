import React from "react";
import {
    Grid,
    Typography, 
    Card,
    IconButton,
    LinearProgress
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";


export default function MusicPlayer(props) {
    const songProgress = (props.progress / props.duration) * 100;

    async function pauseSong() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };
        await fetch("/music_app/spotify/pause", requestOptions);
    }

    async function playSong() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };
        await fetch("/music_app/spotify/play", requestOptions);
    }

    async function skipSong() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        await fetch("/music_app/spotify/skip", requestOptions);
    }

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={props.image_url} heigth="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {props.artist}
                    </Typography>
                    <div>
                        <IconButton
                            onClick={
                                () => { props.is_playing ? pauseSong() : playSong() }
                            }
                        >
                            { props.is_playing ? <PauseIcon /> : <PlayArrowIcon /> }
                        </IconButton>
                        <IconButton onClick={ () => skipSong() }>
                            {props.votes}{ " / " }{props.votes_required}
                            <SkipNextIcon />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}