import {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import s from "../TasksList.module.css";

type FilteredTasksCounterProps = {
    allTasksQuantity: number;
    filteredTasksQuantity: number;
}

export const FilteredTasksCounter = ({allTasksQuantity = 0, filteredTasksQuantity = 0}: FilteredTasksCounterProps) => {
    const [currentTasksQuantityToShow, setCurrentTasksQuantityToShow] = useState<number>(allTasksQuantity);

    useEffect(() => {
        setCurrentTasksQuantityToShow(filteredTasksQuantity);
    }, [filteredTasksQuantity]);

    return (
        filteredTasksQuantity !== 0 ? (
            <Box className={s.counterWrapper}>
                <span>Showed tasks: </span>
                <span className={s.counter}>{currentTasksQuantityToShow}</span>
            </Box>
        ) : null
    );
};
