import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";


export default function About() {
    const history = useHistory();

    return (
        <Grid
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "90vh" }}
        >
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    This app allows you to host or join rooms and contol the host's Spotify playback.
                </Typography>
                <Typography variant="body1">
                    The host needs to start playing something from their Spotify account for this to work.
                </Typography>
                <Typography variant="body1">
                    Also the host's Spotify account has to have Premium. Their rules, not mine ¯\_(ツ)_/¯ .
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    <Button
                        color="secondary"
                        variant="contained"
                        to="/" 
                        component={Link}
                    >
                        back
                    </Button>
                </Typography>
            </Grid>
        </Grid>
    );
}