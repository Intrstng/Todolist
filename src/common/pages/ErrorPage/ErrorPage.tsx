import s from "./ErrorPage.module.css"
import {PATH} from "@/common/constants";
import Button from "@mui/material/Button";
import {Navigate} from "react-router-dom";
import {useState} from "react";
import Box from "@mui/material/Box";

export const ErrorPage = () => {
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const onClickRedirect = () => {
        setShouldRedirect(true);
    }

    if (shouldRedirect) {
        return <Navigate to={PATH.ROOT} />;
    }

    return <Box className={s.errorContainer}>
                <h1 className={s.title}>404</h1>
                <h2 className={s.subtitle}>page not found</h2>
                <Button variant='outlined' onClick={onClickRedirect} className={s.errorButton}>Back</Button>
            </Box>
}
