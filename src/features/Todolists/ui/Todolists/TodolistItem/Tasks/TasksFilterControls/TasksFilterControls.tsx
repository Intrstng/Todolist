import {useCallback} from 'react';
import Box from "@mui/material/Box";
import S from "../TasksList.module.css";
import {Button} from "@/common/components/Button/Button.tsx";
import {FilterValuesType, TodolistDomainType, todoListsActions} from "@/features/Todolists/model/slices";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

type TasksFilterControlsProps = {
    todolist: TodolistDomainType;
};

export const TasksFilterControls = ({todolist}: TasksFilterControlsProps) => {
    const dispatch = useAppDispatch();

    const changeFilter = useCallback(
        (todolistID: string, value: FilterValuesType) => {
            dispatch(todoListsActions.changeFilter({todolistID, value}));
        },
        [dispatch],
    );
    const onclickSetAllFilter = useCallback(() => changeFilter(todolist.id, 'all'), [changeFilter, todolist.id]);
    const onclickSetActiveFilter = useCallback(() => changeFilter(todolist.id, 'active'), [changeFilter, todolist.id]);
    const onclickSetCompletedFilter = useCallback(
        () => changeFilter(todolist.id, 'completed'),
        [changeFilter, todolist.id],
    );

    return (
        <Box className={S.controls}>
            <Button
                onClickCallBack={onclickSetAllFilter}
                variant={todolist.filter === 'all' ? 'contained' : 'outlined'}
                size={'medium'}
                disabled={todolist.entityStatus === 'loading'}
            >
                All
            </Button>
            <Button
                onClickCallBack={onclickSetActiveFilter}
                variant={todolist.filter === 'active' ? 'contained' : 'outlined'}
                size={'medium'}
                disabled={todolist.entityStatus === 'loading'}
            >
                Active
            </Button>
            <Button
                onClickCallBack={onclickSetCompletedFilter}
                variant={todolist.filter === 'completed' ? 'contained' : 'outlined'}
                size={'medium'}
                disabled={todolist.entityStatus === 'loading'}
            >
                Completed
            </Button>
        </Box>
    );
};