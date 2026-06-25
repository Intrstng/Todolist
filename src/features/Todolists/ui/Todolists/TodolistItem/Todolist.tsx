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
import {Grid} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useSortable } from "@dnd-kit/react/sortable"
import { CollisionPriority } from "@dnd-kit/abstract"
import { TodolistDomainType } from "@/features/Todolists/lib/types";

type TodolistProps = {
  todolist: TodolistDomainType;
  sortIndex: number;
};

export const Todolist = memo(({ todolist, sortIndex }: TodolistProps) => {
  const [isTaskListCollapsed, setTaskListCollapsed] = useState<boolean>(true);
  const [deleteTodolist] = useDeleteTodolistMutation()

  const { ref } = useSortable({
    id: todolist.id,
    index: sortIndex,
    type: "todolistItem",
    collisionPriority: CollisionPriority.Low,
    accept: ["taskItem", "todolistItem"],
  })

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

  // const style = isDropTarget ? { background: "#00000030" } : undefined

  return (
      // <Grid ref={ref} style={style}>
      <Grid ref={ref}>
        <Paper elevation={3}>
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
        </Paper>
      </Grid>
  );
});
