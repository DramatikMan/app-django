import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";


export default function Room(props) {
    const roomCode = props.match.params.roomCode;
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const history = useHistory();

    async function getRoomDetails() {
        const response = await fetch("/api/get-room" + "?code=" + roomCode);
        if (!response.ok) { history.push("/"); }
        const responseData = await response.json();
        setVotesToSkip(responseData.votes_to_skip);
        setGuestCanPause(responseData.guest_can_pause);
        setIsHost(responseData.is_host);
    }

    useEffect(() => { getRoomDetails(); }, []);

    async function leaveButtonPressed() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };
        await fetch("/api/leave-room", requestOptions);
        history.push("/");
    }

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
                    onClick={leaveButtonPressed}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}