import React, {FC, memo, useMemo} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import S from './TasksList.module.css';
import {useAppSelector} from '../../../../../../app/store';
import {Task} from './Task/Task';
import {TaskDomainType, TaskStatuses} from '../../../../../../api/task-api';
import {TodolistDomainType} from '../../../../model/slices'
import Paper from "@mui/material/Paper";
import {TasksFilterControls} from "./TasksFilterControls/TasksFilterControls";
import {FilteredTasksCounter} from "./FilteredTasksCounter/FilteredTasksCounter";

type TasksListProps = {
    todolist: TodolistDomainType;
};

export const TasksList: FC<TasksListProps> = memo(({todolist}) => {
    const tasks = useAppSelector<TaskDomainType[]>((state) => state.tasks.tasks[todolist.id]);
    const [listRef] = useAutoAnimate<HTMLUListElement>();

    let tasksForTodoList: TaskDomainType[] = tasks;

    tasksForTodoList = useMemo(() => {
        return todolist.filter === 'active'
            ? tasksForTodoList.filter((task) => task.status === TaskStatuses.New)
            : todolist.filter === 'completed'
                ? tasksForTodoList.filter((task) => task.status === TaskStatuses.Completed)
                : tasksForTodoList;
    }, [todolist.filter, tasksForTodoList]);

    const listItems: JSX.Element =
        tasksForTodoList.length === 0 ? (
            <span className={S.errorMessage}>No tasks in list. Add new task...</span>
        ) : (
            <ul ref={listRef}>
                {tasksForTodoList.map((task) => {
                    return <Task key={task.id} todolist={todolist} task={task}/>;
                })}
            </ul>
        );

    return (
        <Paper className={S.taskList} elevation={4} sx={{backgroundColor: 'rgba(240,239,239,0.74)'}}>
            {listItems}
            <FilteredTasksCounter allTasksQuantity={tasks?.length || 0} filteredTasksQuantity={tasksForTodoList?.length || 0}/>
            {tasks.length !== 0 && <TasksFilterControls todolist={todolist}/>}
        </Paper>
    );
});
