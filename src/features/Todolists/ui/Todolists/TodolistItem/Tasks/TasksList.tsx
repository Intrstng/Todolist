import {JSX, memo, useMemo} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import S from './TasksList.module.css';
import {Task} from './Task/Task';
import Paper from "@mui/material/Paper";
import {TasksFilterControls} from "./TasksFilterControls/TasksFilterControls";
import {FilteredTasksCounter} from "./FilteredTasksCounter/FilteredTasksCounter";
import {TaskDomainType} from "@/features/Todolists/api/taskApi.types.ts";
import {TaskStatuses} from "@/common/enums/enums.ts";
import {TodolistDomainType} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";
import {useGetTasksQuery} from "@/features/Todolists/api/_taskApi.ts";

type TasksListProps = {
    todolist: TodolistDomainType;
};

export const TasksList = memo(({todolist}: TasksListProps) => {
   // const tasks = useAppSelector<TaskDomainType[]>((state) => state.tasks[todolist.id]);
    // const tasks = useAppSelector<TaskDomainType[]>((state) => todolistTasksSelector(state, todolist.id));
    const [listRef] = useAutoAnimate<HTMLUListElement>();
    // const dispatch = useAppDispatch()
    const { data } = useGetTasksQuery(todolist.id)

    // Check!
    // useEffect(() => {
    //     dispatch(tasksActions.fetchTasks(todolist.id))
    // }, [])

    const tasks: TaskDomainType[] | undefined = data?.items
    let tasksForTodoList: TaskDomainType[] | undefined = data?.items;

    tasksForTodoList = useMemo(() => {
        return todolist.filter === 'active'
            ? tasksForTodoList?.filter((task) => task.status === TaskStatuses.New)
            : todolist.filter === 'completed'
                ? tasksForTodoList?.filter((task) => task.status === TaskStatuses.Completed)
                : tasksForTodoList;
    }, [todolist.filter, tasksForTodoList]);

    const listItems: JSX.Element =
        tasksForTodoList?.length === 0 ? (
            <span className={S.errorMessage}>No tasks in list. Add new task...</span>
        ) : (
            <ul ref={listRef}>
                {tasksForTodoList?.map((task) => {
                    return <Task key={task.id} todolist={todolist} task={task}/>;
                })}
            </ul>
        );

    return (
        <Paper className={S.taskList} elevation={4} sx={{backgroundColor: 'rgba(240,239,239,0.74)'}}>
            {listItems}
            <FilteredTasksCounter allTasksQuantity={tasks?.length || 0} filteredTasksQuantity={tasksForTodoList?.length || 0}/>
            {tasks?.length !== 0 && <TasksFilterControls todolist={todolist}/>}
        </Paper>
    );
});
