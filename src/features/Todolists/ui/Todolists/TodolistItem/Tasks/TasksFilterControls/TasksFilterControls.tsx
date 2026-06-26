import {useCallback} from 'react';
import {todolistsApi} from "@/features/Todolists/api/todolistApi.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch";
import {FilterValuesType} from "@/features/Todolists/lib/types";
import {Button} from "@/common/components/Button/Button.tsx";
import {
    TasksFilterControlsProps
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksFilterControls/TasksFilterControls.types.ts";
import Box from "@mui/material/Box";
import s from "../TasksList.module.css";

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