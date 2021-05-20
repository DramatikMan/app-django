import React, { useState } from "react";
import {
    Button,
    Grid,
    Typography,
    TextField
} from "@material-ui/core";
import { render } from "react-dom";
import { Link, useHistory } from "react-router-dom";


export default function RoomJoinPage() {
    const [roomCode, setRoomCode] = useState(0);
    const [error, setError] = useState(0);
    const history = useHistory();

    function enterRoomPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: roomCode})
        };
        fetch("/api/join-room", requestOptions).then((response) => {
            if (response.ok) { history.push(`/room/${roomCode}`) }
            else { setError("Room not found.") }
        }).catch((error) => {
            console.log(error);
        });
    };

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
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={Boolean(error)}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={(e) => setRoomCode(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={enterRoomPressed}
                >
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    to="/"
                    component={Link}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}