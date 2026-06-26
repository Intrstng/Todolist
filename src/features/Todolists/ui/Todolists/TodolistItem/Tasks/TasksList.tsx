import {JSX, memo, useMemo, useRef, useState} from 'react';
import {useSearchParams} from "react-router";
import {Data, Droppable} from "@dnd-kit/abstract";
import {DragDropProvider, type DragEndEvent} from "@dnd-kit/react";
import {move} from "@dnd-kit/helpers";
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {TaskDomainType} from "@/features/Todolists/lib/types/taskApi.types.ts";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {PAGE_SIZE} from "@/common/constants";
import {useGetTasksQuery, useTasksReorderMutation} from "@/features/Todolists/api/taskApi.ts";
import {TasksFilterControls} from "./TasksFilterControls/TasksFilterControls";
import {FilteredTasksCounter} from "./FilteredTasksCounter/FilteredTasksCounter";
import {
    TasksPagination
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx";
import List from "@mui/material/List";
import {TasksListProps} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksList.types.ts";
import {Task} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/Task";
import Paper from "@mui/material/Paper";
import s from './TasksList.module.css';

export const TasksList = memo(({todolist}: TasksListProps) => {
    const {id: todolistId, filter} = todolist
    const [page, setPage] = useState<number>(1)
    const [_searchParams, setSearchParams] = useSearchParams()
    const [listRef] = useAutoAnimate<HTMLUListElement>();
    const [tasksReorder] = useTasksReorderMutation()

    const {data, isLoading} = useGetTasksQuery({
        todolistID: todolistId,
        params: {count: PAGE_SIZE, page},
    })

    const tasks = data?.items
    let tasksForTodoList: TaskDomainType[] | undefined = data?.items;
    const previousItems = useRef(data?.items || [])

    const changePage = (page: number) => {
        setPage(page)
        setSearchParams({page: page.toString()})
    }

    const setTasksOrder = (
        targetTodolistId: string,
        tasks: TaskDomainType[] | undefined,
        event: DragEndEvent,
        target: Droppable<Data> | null,
    ) => {
        if (tasks) {
            const sortedNewTasks: TaskDomainType[] = move(tasks, event)

            const targetTaskId = target?.id
            if (!targetTaskId || !targetTodolistId) return

            const targetTaskIndex = sortedNewTasks.findIndex((task) => task.id === targetTaskId)
            console.log(targetTaskIndex)

            if (targetTaskIndex === -1) return
            if (sortedNewTasks.length === 1 || targetTaskIndex === 0) {
                tasksReorder({
                    todolistID: targetTodolistId,
                    taskID: targetTaskId,
                    putAfterItemId: null,
                })
            } else {
                const taskPlacedBeforeTargetTask = sortedNewTasks[targetTaskIndex - 1]
                const prevTaskId = taskPlacedBeforeTargetTask.id
                tasksReorder({
                    todolistID: targetTodolistId,
                    taskID: targetTaskId,
                    putAfterItemId: prevTaskId,
                })
            }
        }
    }

    tasksForTodoList = useMemo(() => {
        return filter === 'active'
            ? tasksForTodoList?.filter((task) => task.status === TaskStatuses.New)
            : filter === 'completed'
                ? tasksForTodoList?.filter((task) => task.status === TaskStatuses.Completed)
                : tasksForTodoList;
    }, [filter, tasksForTodoList]);

    const noTasksContent: JSX.Element = <span className={s.errorMessage}>No tasks in list. Add new task...</span>

    const listItems: JSX.Element =
        tasksForTodoList?.length === 0 ? noTasksContent : (
            <List ref={listRef}>
                {tasksForTodoList?.map((task, sortIndex) => {
                    return <Task key={task.id} todolist={todolist} task={task} sortIndex={sortIndex}/>;
                })}
            </List>
        );

    if (isLoading) {
        return noTasksContent;
    }

    return (
        <DragDropProvider
            // onDragOver={(event) => {
            //   setTodolistsOrder(todolists, event)
            // }}
            onDragStart={() => {
                previousItems.current = tasksForTodoList || []
            }}
            onDragEnd={(event) => {
                const {source, target} = event.operation

                if (event.canceled || source?.type !== "taskItem") return
                setTasksOrder(todolistId, previousItems.current, event, target)
            }}
        >
            <Paper className={s.taskList} elevation={4} sx={{backgroundColor: 'rgba(240,239,239,0.74)'}}>
                {/*{isLoading ? <TasksSkeleton /> : listItems}*/}
                {listItems}
                <FilteredTasksCounter allTasksQuantity={tasks?.length || 0}
                                      filteredTasksQuantity={tasksForTodoList?.length || 0}/>

                {(data?.totalCount || 0) > PAGE_SIZE && (
                    <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={changePage}/>
                )}

                {tasks?.length !== 0 && <TasksFilterControls todolist={todolist}/>}
            </Paper>
        </DragDropProvider>
    );
});
