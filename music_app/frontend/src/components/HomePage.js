import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";


export default function HomePage() {
    const history = useHistory();

    async function redirectIfUserInRoom() {
        let response = await fetch("/api/user-in-room");
        let responseData = await response.json();
        if (responseData.code) {
            history.push(`/room/${responseData.code}`);
        }
    }

    useEffect(() => { redirectIfUserInRoom(); }, []);

    return (
        <Grid
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "90vh" }}
        >
            <Grid item xs={12}>
                <Typography variant="h3" compact="h3">
                    Music App
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ButtonGroup
                    disableElevation
                    variant="contained"
                    color="primary"
                >
                    <Button color="primary" to="/join" component={Link}>
                        Join a Room
                    </Button>
                    <Button color="default" to="/about" component={Link}>
                        About
                    </Button>
                    <Button color="secondary" to="/create" component={Link}>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}