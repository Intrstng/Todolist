import {useCallback} from 'react';
import Box from "@mui/material/Box";
import s from "../TasksList.module.css";
import {Button} from "@/common/components/Button/Button.tsx";
import {FilterValuesType, TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema";
import { useAppDispatch } from "@/common/hooks/useAppDispatch";
import {todolistsApi} from "@/features/Todolists/api/todolistApi.ts";

type TasksFilterControlsProps = {
    todolist: TodolistDomainType;
};

export const TasksFilterControls = ({todolist}: TasksFilterControlsProps) => {
    const dispatch = useAppDispatch();
       const changeFilter = (filter: FilterValuesType) => {
        dispatch(
            todolistsApi.util.updateQueryData(
                // название эндпоинта, в котором нужно обновить кэш
                'getTodolists',
                // аргументы для эндпоинта
                undefined,
                // `updateRecipe` - коллбэк для обновления закэшированного стейта мутабельным образом
                state => {
                    const todoListToChange = state.find(tl => tl.id === todolist.id)
                    if (todoListToChange) {
                        todoListToChange.filter = filter
                    }
                }
            )
        )
    }

    const onclickSetAllFilter = useCallback(() => changeFilter('all'), [changeFilter, todolist.id]);
    const onclickSetActiveFilter = useCallback(() => changeFilter('active'), [changeFilter, todolist.id]);
    const onclickSetCompletedFilter = useCallback(() => changeFilter('completed'), [changeFilter, todolist.id]);

    return (
        <Box className={s.controls}>
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