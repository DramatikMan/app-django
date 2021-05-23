import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import RoomSettingsPage from "./RoomSettingsPage"


export default function Room(props) {
    const roomCode = props.match.params.roomCode;
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState();

    const history = useHistory();

    async function authenticateSpotify() {
        let response = await fetch("/spotify/is-authenticated");
        let responseData = await response.json();
        if (responseData.status == false) {
            let response = await fetch("/spotify/get-auth-url");
            let responseData = await response.json();
            window.location.href = responseData.url;
        }
        else { setSpotifyAuthenticated(true); }
    }

    async function getCurrentSong() {
        const response = await fetch('/spotify/current-song');
        if (!response.ok) { return {}; }
        else {
            const responseData = await response.json();
            setSong(responseData);
        }
    }

    async function getRoomDetails() {
        const response = await fetch("/api/get-room" + "?code=" + roomCode);
        if (!response.ok) { history.push("/"); }
        const responseData = await response.json();
        setVotesToSkip(responseData.votes_to_skip);
        setGuestCanPause(responseData.guest_can_pause);
        setIsHost(responseData.is_host);
        if (responseData.is_host) { authenticateSpotify(); }
    }

    async function leaveButtonPressed() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };
        await fetch("/api/leave-room", requestOptions);
        history.push("/");
    }

    const updateCallback = () => {
        getRoomDetails();
        setShowSettings(false);
    }

    const renderSettings = () => {
        return (
            <RoomSettingsPage
                update={true}
                roomCode={roomCode}
                votesToSkip={votesToSkip}
                guestCanPause={guestCanPause}
                updateCallback={updateCallback}
            />
        );
    }
    
    const renderSettingsButton = () => {
        return (
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ () => setShowSettings(true) }
                >
                    settings
                </Button>
            </Grid>
        );
    }

    useEffect(() => { getRoomDetails(); }, []);
    useEffect(() => {
        const interval = setInterval(() => { getCurrentSong(); }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (showSettings) { return renderSettings(); }
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
            { isHost ? renderSettingsButton() : null }
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveButtonPressed}
                >
                    leave room
                </Button>
            </Grid>
        </Grid>
    );
}