import {
    TasksCounterProps
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksCounter/TasksCounter.types.ts";
import Box from "@mui/material/Box";
import s from "../../Todolist.module.css";

export const TasksCounter = ({tasksQuantity = 0}: TasksCounterProps) => {
    return (
        <Box className={s.counterWrapper}>
            <span>All tasks:</span>
            <Box className={s.counter}>
                <span>{tasksQuantity}</span>
            </Box>
        </Box>
    );
};

