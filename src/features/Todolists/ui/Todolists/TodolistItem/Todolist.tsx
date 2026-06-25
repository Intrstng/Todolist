import {memo, useCallback, useState} from 'react';
import {TasksList} from './Tasks';
import {Button} from '@/common/components/Button/Button.tsx';
import s from './Todolist.module.css';
import Box from "@mui/material/Box";
import {TodolistTitle} from "./TodolistTitle/TodolistTitle";
import {CreateTaskItemForm} from "./Tasks/CreateTaskItemForm";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import {useDeleteTodolistMutation} from "@/features/Todolists/api/todolistApi.ts";
import {TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";

type TodolistProps = {
  todolist: TodolistDomainType;
};

export const Todolist = memo(({ todolist }: TodolistProps) => {
  const [isTaskListCollapsed, setTaskListCollapsed] = useState<boolean>(true);
  const [deleteTodolist] = useDeleteTodolistMutation()

  const onClickRemoveTodolist = useCallback(() => {
    deleteTodolist(todolist.id)
  }, [todolist.id]);

  const onClickTasksListCollapseToggle = useCallback(() => {
    setTaskListCollapsed(!isTaskListCollapsed);
  }, [setTaskListCollapsed, isTaskListCollapsed]);

  const unCollapseTasksList = useCallback(() => {
    setTaskListCollapsed(true);
  }, [setTaskListCollapsed]);

  const toggleShowTasksListBtnName = isTaskListCollapsed ? 'Hide tasks list' : 'Show tasks list';

  return (
    <Box className={s.todolist}>
      <Box className={s.todolist__titleContent}>
        <TodolistTitle todolist={todolist}/>
        <IconButton aria-label='delete'
                    onClick={onClickRemoveTodolist}
                    disabled={todolist.entityStatus === 'loading'}
                    sx={{
                      '&.Mui-disabled': {
                        opacity: 0.3,
                        cursor: 'not-allowed',
                      }
                    }}
        >
            <ClearIcon fontSize='medium' color='error'/>
        </IconButton>
      </Box>
        <CreateTaskItemForm todolist={todolist} toggleTaskListCollapsed={unCollapseTasksList}/>
          <Box className={s.tasksShowToggle}>
            <Button
              variant={isTaskListCollapsed ? 'outlined' : 'contained'}
              color={isTaskListCollapsed ? 'warning' : 'success'}
              onClickCallBack={onClickTasksListCollapseToggle}
              disabled={todolist.entityStatus === 'loading'}
            >
              {toggleShowTasksListBtnName}
            </Button>
          </Box>
          {isTaskListCollapsed ? <TasksList todolist={todolist} /> : null}
    </Box>
  );
});
