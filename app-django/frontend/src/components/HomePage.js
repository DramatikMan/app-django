import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";


export default function HomePage() {
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
                    <Button color="primary" to="/join" component={ Link }>
                        Join a Room
                    </Button>
                    <Button color="secondary" to="/create" component={ Link }>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}