import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

import {getTranslation} from "~/translation";
import type {Props} from "~/types";

export default async function About(props: Props) {
    const t = await getTranslation(props.params.lang);

    return (
        <Grid
            container
            xs={12}
            sx={{height: "100svh"}}
            alignContent={"center"}
            justifyContent={"center"}
        >
            <Grid container xs={4} rowGap={{xs: 1, sm: 2, md: 3}}>
                <Grid container xs={12} justifyContent={"center"}>
                    <Typography variant="body1" align="center">
                        {t.about}
                    </Typography>
                </Grid>
                <Grid container xs={12} justifyContent={"center"}>
                    <Link href={"/"}>
                        <Button color="secondary" variant="contained">
                            Back
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    );
}
