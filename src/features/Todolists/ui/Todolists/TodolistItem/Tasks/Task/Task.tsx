import {ChangeEvent, memo} from 'react';
import { useSortable } from "@dnd-kit/react/sortable"
import {Button} from '@/common/components/Button/Button.tsx';
import {EditableSpan} from "@/common/components";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {useDeleteTaskMutation, useUpdateTaskMutation} from "@/features/Todolists/api/taskApi.ts";
import {TaskProps} from "./Task.types";
import {
    deleteTaskBtnStyle, getListItemSx,
    inputFieldStyle
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/Task/Task.styles.ts";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from '@mui/icons-material/Delete';
import s from './Task.module.css';

export const Task = memo(({ todolist, task, sortIndex }: TaskProps) => {
    const isTaskCompleted = task.status === TaskStatuses.Completed
    const [updateTask] = useUpdateTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()

    const { ref, isDragging } = useSortable({
        id: task.id,
        index: sortIndex,
        type: "taskItem",
        accept: "taskItem",
        group: todolist.id,
    })

  const onBlur = (title: string) => {
        updateTask({data: {
                todolistID: todolist.id,
                taskID: task.id,
                model: { title }
            }})
    }

  const onChangeInputStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValueFlag = e.currentTarget.checked;
    const statusValue: TaskStatuses = newStatusValueFlag ? TaskStatuses.Completed : TaskStatuses.New;
      updateTask({data: {
          todolistID: todolist.id,
          taskID: task.id,
              model: {
                  status: statusValue,
                  title: task.title // Backend needs this field
              }
      }})
  };
  const onclickBtnRemoveTask = () => {
    deleteTask({data: {
        todolistID: todolist.id,
        taskID: task.id,
        }
    })
  };

  // Or just `task.entityStatus === 'loading'` (then change in props todolist to todolistID)
  const isLoading = todolist.entityStatus === 'loading' || task.entityStatus === 'loading';

  return (
    <ListItem className={s.taskItem} ref={ref} data-dragging={isDragging} sx={getListItemSx(isTaskCompleted)}>
      <input
        id={task.id}
        type={'checkbox'}
        checked={isTaskCompleted}
        onChange={onChangeInputStatus}
        disabled={isLoading}
      />

      <label htmlFor={task.id}>
        <EditableSpan
          oldTitle={task.title}
          onBlurCallBack={onBlur}
          style={inputFieldStyle}
          disabled={isLoading}
        />
      </label>

      <Button
        variant={isTaskCompleted ? 'contained' : 'outlined'}
        color={'error'}
        disabled={isLoading || !task.status}
        endIcon={<DeleteIcon />}
        style={deleteTaskBtnStyle}
        onClickCallBack={onclickBtnRemoveTask}
      >
        Delete
      </Button>
    </ListItem>
  );
});
