import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Todolists} from "@/features/Todolists/ui/Todolists/Todolists.tsx";

export const Main = () => {
    return (
        <Container maxWidth='xl' fixed sx={{ marginTop: '40px' }}>
            <Grid container spacing={2}>
                <Todolists />
            </Grid>
        </Container>
    );
};
