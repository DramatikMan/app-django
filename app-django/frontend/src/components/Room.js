import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";


export default function Room(props) {
    const roomCode = props.match.params.roomCode;
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    async function getRoomDetails() {
        let response = await fetch("/api/get-room" + "?code=" + roomCode);
        let responseData = await response.json();
        setVotesToSkip(responseData.votes_to_skip);
        setGuestCanPause(responseData.guest_can_pause);
        setIsHost(responseData.is_host);
    }

    useEffect(() => { getRoomDetails(); }, []);

    return (
        <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "90vh" }}
        >
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Room Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    to="/"
                    component={Link}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}