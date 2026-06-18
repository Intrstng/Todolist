import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import S from "../TasksList.module.css";
import {TaskDomainType} from "../../../../../api/taskApi.ts";

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
            <Box className={S.counterWrapper}>
                <span>Showed tasks: </span>
                <span className={S.counter}>{currentTasksQuantityToShow}</span>
            </Box>
        ) : null
    );
};
