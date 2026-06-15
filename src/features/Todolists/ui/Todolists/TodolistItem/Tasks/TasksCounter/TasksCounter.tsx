import React from 'react';
import S from "../../Todolist.module.css";
import Box from "@mui/material/Box";
import {TaskDomainType} from "../../../../../../../api/task-api";

type TasksCounterProps = {
    tasksQuantity: number;
}

export const TasksCounter = ({tasksQuantity = 0}: TasksCounterProps) => {
    return (
        <Box className={S.counterWrapper}>
            <span>All tasks:</span>
            <Box className={S.counter}>
                <span>{tasksQuantity}</span>
            </Box>
        </Box>
    );
};

