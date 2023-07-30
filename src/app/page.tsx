import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Link from "next/link";

export default function Home() {
    return (
        <Grid container xs={12} sx={{height: "100svh"}} alignContent={"center"}>
            <Grid container xs={12} justifyContent={"center"}>
                <Typography variant="h3">Music App</Typography>
            </Grid>
            <Grid container xs={12} justifyContent={"center"}>
                <ButtonGroup disableElevation variant="text">
                    <Link href={"/join"}>
                        <Button color="primary">Join a Room</Button>
                    </Link>
                    <Link href={"/about"}>
                        <Button color="info">About</Button>
                    </Link>
                    <Link href={"/create"}>
                        <Button color="secondary">Create a Room</Button>
                    </Link>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}
