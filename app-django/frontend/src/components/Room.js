import React, { useState, useEffect } from "react";


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
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    )
}