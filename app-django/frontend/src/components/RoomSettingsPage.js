import React, { useState } from "react";
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Collapse
} from "@material-ui/core";
import { Alert } from '@material-ui/lab'
import { Link, useHistory } from "react-router-dom";


export default function RoomSettingsPage(props) {
    const isUpdate = props.update ? props.update : false;
    const roomCode = props.roomCode ? props.roomCode : null;
    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause ? props.guestCanPause : false);
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip ? props.votesToSkip : 2);
    const history = useHistory();
    const [alert, setAlert] = useState();

    async function createRoomPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then(response => response.json())
            .then(data => history.push("/room/" + data.code));
    }

    async function updateRoomPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: roomCode,
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }),
        };
        fetch("/api/update-room", requestOptions)
            .then(response => {
                if (response.ok) {setAlert({text: "Room updated.", severity: "success"})}
                else {setAlert({text: "Room update failed.", severity: "error"})}
            });
    }

    const showAlert = (text, severity) => {
        return (
            <Grid item xs={12}>
                <Collapse in={Boolean(alert)}>
                    <Alert
                        variant="filled"
                        severity={severity}
                        onClose={ () => setAlert() }
                    >
                        {text}
                    </Alert>
                </Collapse>
            </Grid>
        )
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
            { alert ? showAlert(alert.text, alert.severity) : null }
            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    { isUpdate ? "Update Room" : "Create a Room" }
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormHelperText>
                        Guest control of playback state
                    </FormHelperText>
                    <RadioGroup
                        row
                        value={String(guestCanPause)}
                        onChange={ e => setGuestCanPause(e.target.value) }
                    >
                        <FormControlLabel
                            value="true"
                            control={ <Radio color="primary" /> }
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={ <Radio color="secondary" /> }
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        defaultValue={votesToSkip}
                        onChange={ e => setVotesToSkip(e.target.value) }
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" }
                        }}
                    />
                    <FormHelperText>
                        Votes required to skip a song
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={ isUpdate ? updateRoomPressed : createRoomPressed }
                >
                    { isUpdate ? "update room" : "create a room" }
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    color="secondary"
                    variant="contained"
                    to="/" 
                    component={Link}
                >
                    back
                </Button>
            </Grid>
        </Grid>
    )
}