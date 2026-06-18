import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Outlet} from "react-router-dom";

export const Main = () => {
    return (
        <Container maxWidth='xl' fixed sx={{ marginTop: '40px' }}>
            <Grid container spacing={2}>
                <Outlet />
            </Grid>
        </Container>
    );
};
