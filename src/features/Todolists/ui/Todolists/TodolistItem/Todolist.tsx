import {memo, useCallback, useState} from 'react';
import {TasksList} from './Tasks';
import {Button} from '@/common/components/Button/Button.tsx';
import S from './Todolist.module.css';
import {useAppSelector} from '@/app/store';
import Box from "@mui/material/Box";
import {TodolistTitle} from "./TodolistTitle/TodolistTitle";
import {CreateTaskItemForm} from "./Tasks/CreateTaskItemForm";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import {TasksCounter} from "./Tasks/TasksCounter/TasksCounter";
import {TodolistDomainType, todoListsActions, todolistTasksSelector} from "@/features/Todolists/model/slices";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {TaskDomainType} from "@/features/Todolists/api/taskApi.types.ts";

type TodolistProps = {
  todolist: TodolistDomainType;
};

export const Todolist = memo(({ todolist }: TodolistProps) => {
  const [isTaskListCollapsed, setTaskListCollapsed] = useState<boolean>(true);
  const dispatch = useAppDispatch();
 // const tasks = useAppSelector<TaskType[]>((state) => state.tasks[todolist.id]);
    const tasks = useAppSelector<TaskDomainType[]>((state) => todolistTasksSelector(state, todolist.id));

  const onClickRemoveTodolist = useCallback(() => {
    dispatch(todoListsActions.removeTodoList({id: todolist.id}));
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
