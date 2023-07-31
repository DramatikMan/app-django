import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Link from "next/link";

export default function Home() {
    return (
        <Grid
            container
            xs={12}
            sx={{height: "100svh"}}
            alignContent={"center"}
            rowGap={{xs: 1, sm: 2, md: 3}}
        >
            <Grid container xs={12} justifyContent={"center"}>
                <Typography variant="h3">Music App</Typography>
            </Grid>
            <Grid container xs={12} justifyContent={"center"}>
                <ButtonGroup variant="text" disableElevation>
                    <Grid container columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid>
                            <Link href={"/join"}>
                                <Button>Join a Room</Button>
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href={"/about"}>
                                <Button color="info">About</Button>
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href={"/create"}>
                                <Button color="secondary">Create a Room</Button>
                            </Link>
                        </Grid>
                    </Grid>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}
