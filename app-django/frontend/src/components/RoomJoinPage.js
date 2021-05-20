import React, { useState } from "react";
import {
    Button,
    Grid,
    Typography,
    TextField
} from "@material-ui/core";
import { Link } from "react-router-dom";


export default function RoomJoinPage() {
    const [roomCode, setRoomCode] = useState();
    const [error, setError] = useState(false);

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
                    error={error}
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
                    onClick={() => console.log(roomCode)}
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