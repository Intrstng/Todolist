import {Todolists} from "@/features/Todolists/ui/Todolists/Todolists.tsx";
import {CreateItemForm} from "@/common/components";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

export const Main = () => {
    return (
        <Container maxWidth='xl' fixed sx={{ marginTop: '40px' }}>
            <Grid container sx={{ mb: "30px" }}>
                <CreateItemForm />
            </Grid>
            <Grid container spacing={2}>
                <Todolists />
            </Grid>
        </Container>
    );
};
