import { ChangeEvent, FC, memo, useCallback, useMemo } from 'react';
import { Button } from '@/common/components/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import S from '../TasksList.module.css';
import { EditableSpan } from "@/common/components";
import {tasksThunks, TodolistDomainType} from "@/features/Todolists/model/slices";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {TaskDomainType} from "@/features/Todolists/api/taskApi.types.ts";

type Task = {
  todolist: TodolistDomainType;
  task: TaskDomainType;
};

export const Task: FC<Task> = memo(({ todolist, task }) => {
  const dispatch = useAppDispatch();
  const finalTaskItemClassList = `${S.taskItem} ${task.status === TaskStatuses.Completed ? S.completed : ''}`;

  const onBlur = useCallback(
    (title: string) => {
      dispatch(tasksThunks.updateTaskTC({
          todolistID: todolist.id,
          taskID: task.id,
          model: { title }
      }));
    },
    [dispatch, todolist.id, task.id],
  );

  const onChangeInputStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValueFlag = e.currentTarget.checked;
    const statusValue: TaskStatuses = newStatusValueFlag ? TaskStatuses.Completed : TaskStatuses.New;
    dispatch(tasksThunks.updateTaskTC({
        todolistID: todolist.id,
        taskID: task.id,
        model: { status: statusValue }
    }));
  };
  const onclickBtnRemoveTask = () => {
    dispatch(tasksThunks.removeTaskTC({todolistID: todolist.id, taskID: task.id}));
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
