import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Skeleton from "@mui/material/Skeleton"
import s from "./TodolistSkeleton.module.css"
import {SKELETON_GALLERY} from "@/common/constants";

export const TodolistSkeleton = () => (
    <Paper className={s.container}>
        <Box className={s.title}>
            <Skeleton width={150} height={50}/>
            <Skeleton width={20} height={40}/>
        </Box>
        <Box className={s.createItemForm}>
            <Skeleton width={170} height={60}/>
            <Skeleton width={70} height={50}/>
        </Box>
        <Box className={s.hideTasks}>
            <Skeleton width={160} height={45}/>
            <Skeleton width={60} height={35}/>
            <Skeleton variant="circular" width={20} height={20}/>
        </Box>
        {Array(SKELETON_GALLERY)
            .fill(null)
            .map((_, id) => (
                <Box className={s.tasks} key={id}>
                    <Skeleton width={180} height={50}/>
                    <Skeleton width={70} height={40}/>
                </Box>
            ))}
        <Box className={s.showedTasks}>
            <Skeleton width={80} height={35}/>
            <Skeleton variant="circular" width={20} height={20}/>
        </Box>
        <Box className={s.controls}>
            {Array(SKELETON_GALLERY)
                .fill(null)
                .map((_, id) => (
                    <Skeleton key={id} width={80} height={60}/>
                ))}
        </Box>
    </Paper>
)