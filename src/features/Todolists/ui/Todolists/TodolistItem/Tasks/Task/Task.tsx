import {ChangeEvent, memo, useMemo} from 'react';
import {Button} from '@/common/components/Button/Button.tsx';
import DeleteIcon from '@mui/icons-material/Delete';
import s from '../TasksList.module.css';
import {EditableSpan} from "@/common/components";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {TaskDomainType} from "@/features/Todolists/api/taskApi.types.ts";
import {useDeleteTaskMutation, useUpdateTaskMutation} from "@/features/Todolists/api/taskApi.ts";
import {TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";

type TaskProps = {
  todolist: TodolistDomainType;
  task: TaskDomainType;
};

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

  const inputFieldStyle = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      maxWidth: '138px',
      maxHeight: '30px',
      minWidth: '138px',
      minHeight: '30px',
    }),
    [],
  );

  const deleteTaskBtnStyle = useMemo(
    () => ({
      maxWidth: '94px',
      maxHeight: '40px',
      minWidth: '94px',
      minHeight: '40px',
    }),
    [],
  );
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
