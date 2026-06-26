import {useEffect, useState} from 'react';
import {
    FilteredTasksCounterProps
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/FilteredTasksCounter/FilteredTasksCounter.types.ts";
import Box from "@mui/material/Box";
import s from "./FilteredTasksCounter.module.css";

export const FilteredTasksCounter = ({allTasksQuantity = 0, filteredTasksQuantity = 0}: FilteredTasksCounterProps) => {
    const [currentTasksQuantityToShow, setCurrentTasksQuantityToShow] = useState<number>(allTasksQuantity);

    useEffect(() => {
        setCurrentTasksQuantityToShow(filteredTasksQuantity);
    }, [filteredTasksQuantity]);

    return (
        filteredTasksQuantity !== 0 ? (
            <Box className={s.counterWrapper}>
                <span>Showed tasks:</span>
                <span className={s.counter}>{currentTasksQuantityToShow}</span>
            </Box>
        ) : null
    );
};
