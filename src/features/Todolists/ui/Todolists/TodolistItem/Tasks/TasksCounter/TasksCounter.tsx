import s from "../../Todolist.module.css";
import Box from "@mui/material/Box";

type TasksCounterProps = {
    tasksQuantity: number;
}

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

