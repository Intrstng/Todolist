import {ChangeEvent, memo} from 'react';
import {Button} from '@/common/components/Button/Button.tsx';
import DeleteIcon from '@mui/icons-material/Delete';
import s from './Task.module.css';
import {EditableSpan} from "@/common/components";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {useDeleteTaskMutation, useUpdateTaskMutation} from "@/features/Todolists/api/taskApi.ts";
import {TaskProps} from "./Task.types";
import {
    deleteTaskBtnStyle,
    inputFieldStyle
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/Task/Task.styles.ts";

export const Task = memo(({ todolist, task }: TaskProps) => {
  const finalTaskItemClassList = `${s.taskItem} ${task.status === TaskStatuses.Completed ? s.completed : ''}`;
    const [updateTask] = useUpdateTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()

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
    <li className={finalTaskItemClassList}>
      <input
        id={task.id}
        type={'checkbox'}
        checked={!!task.status}
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
        variant={task.status === TaskStatuses.Completed ? 'contained' : 'outlined'}
        color={'error'}
        disabled={isLoading || !task.status}
        endIcon={<DeleteIcon />}
        style={deleteTaskBtnStyle}
        onClickCallBack={onclickBtnRemoveTask}
      >
        Delete
      </Button>
    </li>
  );
});
