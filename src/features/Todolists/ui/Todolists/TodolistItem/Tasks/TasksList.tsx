import {JSX, memo, useMemo, useState} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import s from './TasksList.module.css';
import {Task} from './Task/Task';
import Paper from "@mui/material/Paper";
import {TasksFilterControls} from "./TasksFilterControls/TasksFilterControls";
import {FilteredTasksCounter} from "./FilteredTasksCounter/FilteredTasksCounter";
import {TaskDomainType} from "@/features/Todolists/lib/types/taskApi.types.ts";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema";
import {useGetTasksQuery} from "@/features/Todolists/api/taskApi.ts";
import {TasksSkeleton} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx";
import {PAGE_SIZE} from "@/common/constants";
import {
    TasksPagination
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx";

type TasksListProps = {
    todolist: TodolistDomainType;
};

export const TasksList = memo(({todolist}: TasksListProps) => {
    const { id: todolistId, filter } = todolist
    const [page, setPage] = useState<number>(1)
                                                                // const [_searchParams, setSearchParams] = useSearchParams()
    const [listRef] = useAutoAnimate<HTMLUListElement>();

    const { data, isLoading, isFetching } = useGetTasksQuery({
        todolistID: todolistId,
        params: { count: PAGE_SIZE, page },
    })

    const tasks = data?.items
    let tasksForTodoList: TaskDomainType[] | undefined = data?.items;

    const changePage = (page: number) => {
        setPage(page)
                                                                  // setSearchParams({ page: page.toString() })
    }

    tasksForTodoList = useMemo(() => {
        return filter === 'active'
            ? tasksForTodoList?.filter((task) => task.status === TaskStatuses.New)
            : filter === 'completed'
                ? tasksForTodoList?.filter((task) => task.status === TaskStatuses.Completed)
                : tasksForTodoList;
    }, [filter, tasksForTodoList]);

    const listItems: JSX.Element =
        tasksForTodoList?.length === 0 ? (
            <span className={s.errorMessage}>No tasks in list. Add new task...</span>
        ) : (
            <ul ref={listRef}>
                {tasksForTodoList?.map((task) => {
                    return <Task key={task.id} todolist={todolist} task={task}/>;
                })}
            </ul>
        );

    if (isLoading || isFetching) {
        return <TasksSkeleton />
    }

    return (
        <Paper className={s.taskList} elevation={4} sx={{backgroundColor: 'rgba(240,239,239,0.74)'}}>
            {listItems}
            <FilteredTasksCounter allTasksQuantity={tasks?.length || 0} filteredTasksQuantity={tasksForTodoList?.length || 0}/>
            {(data?.totalCount || 0) > PAGE_SIZE && (
                <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={changePage} />
            )}
            {tasks?.length !== 0 && <TasksFilterControls todolist={todolist}/>}
        </Paper>
    );
});
