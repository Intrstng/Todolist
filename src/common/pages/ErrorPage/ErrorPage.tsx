import s from "./ErrorPage.module.css"
import {PATH} from "@/common/constants";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router";

export const ErrorPage = () => {
    const navigate = useNavigate();

    const redirectToMainPage = () => {
        navigate(PATH.ROOT)
    }

    return <Box className={s.errorContainer}>
                <h1 className={s.title}>404</h1>
                <h2 className={s.subtitle}>page not found</h2>
                <Button onClick={redirectToMainPage}
                        variant="contained"
                        sx={{
                            width: { xs: "100%", sm: 200, md: 250 }, // responsive widths
                            margin: "30px auto 0",
                        }}
                >
                    To the main page
                </Button>
            </Box>
}
