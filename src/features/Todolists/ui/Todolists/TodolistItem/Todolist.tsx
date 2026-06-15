import React, {FC, memo, useCallback, useState} from 'react';
import {TasksList} from './Tasks';
import {Button} from '../../../../../common/components/Button';
import S from './Todolist.module.css';
import {useAppDispatch, useAppSelector} from '../../../../../app/store';
import {removeTodoListTC, TodolistDomainType} from '../../../model/slices';
import {TaskType} from '../../../../../api/task-api';
import Box from "@mui/material/Box";
import {TodolistTitle} from "./TodolistTitle/TodolistTitle";
import {CreateTaskItemForm} from "./Tasks/CreateTaskItemForm";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import {TasksCounter} from "./Tasks/TasksCounter/TasksCounter";

type TodolistPropsType = {
  todolist: TodolistDomainType;
};

export const Todolist: FC<TodolistPropsType> = memo(({ todolist }) => {
  const [isTaskListCollapsed, setTaskListCollapsed] = useState<boolean>(true);
  const dispatch = useAppDispatch();
 const tasks = useAppSelector<TaskType[]>((state) => state.tasks.tasks[todolist.id]);

  const onClickRemoveTodolist = useCallback(() => {
    dispatch(removeTodoListTC(todolist.id));
  }, [dispatch, todolist.id]);

  const onClickTasksListCollapseToggle = useCallback(() => {
    setTaskListCollapsed(!isTaskListCollapsed);
  }, [setTaskListCollapsed, isTaskListCollapsed]);

  const unCollapseTasksList = useCallback(() => {
    setTaskListCollapsed(true);
  }, [setTaskListCollapsed]);


  const toggleShowTasksListBtnName = isTaskListCollapsed ? 'Hide tasks list' : 'Show tasks list';

  return (
    <Box className={S.todolist}>
      <Box className={S.todolist__titleContent}>
        <TodolistTitle todolist={todolist}/>
        <IconButton aria-label='delete' onClick={onClickRemoveTodolist} disabled={todolist.entityStatus === 'loading'}>
            <ClearIcon fontSize='medium' color='error'/>
        </IconButton>
      </Box>
        <CreateTaskItemForm todolist={todolist} toggleTaskListCollapsed={unCollapseTasksList}/>
          <Box className={S.tasksShowToggle}>
            <Button
              variant={isTaskListCollapsed ? 'outlined' : 'contained'}
              color={isTaskListCollapsed ? 'warning' : 'success'}
              onClickCallBack={onClickTasksListCollapseToggle}
              disabled={todolist.entityStatus === 'loading'}
            >
              {toggleShowTasksListBtnName}
            </Button>
              <TasksCounter tasksQuantity={tasks?.length}/>
          </Box>
          {isTaskListCollapsed ? <TasksList todolist={todolist} /> : null}
    </Box>
  );
});
