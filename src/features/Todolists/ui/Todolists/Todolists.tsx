import {memo, useEffect} from 'react';
import {Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {Todolist} from './TodolistItem/Todolist';
import {useAppSelector} from '@/app/store';
import {Navigate} from 'react-router-dom';
import {CreateItemForm} from "@/common/components";
import {TodolistDomainType, todoListsSelector, todolistsThunks} from "@/features/Todolists/model/slices";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {authIsLoggedInSelector} from "@/features/Login/model/slices/authSlice.ts";

export const Todolists = memo(() => {
  const dispatch = useAppDispatch();
  const todoLists = useAppSelector<TodolistDomainType[]>(todoListsSelector);
  const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(todolistsThunks.fetchTodoListsTC());
  }, []);

  if (!isLoggedIn) {
    // Conditional after ALL hooks
    return <Navigate to={'/login'} />;
  }
  // Добавить эти редиректы нужно непосредственно перед return, то есть после всех хуков, которые используются внутри компонент, иначе будет нарушено правило работы с хуками, говорящее, что нельзя использовать хуки внутри компоненты в условной логике.

  return (
    <>
      <CreateItemForm/>
      {todoLists.map((tl) => (
        <Grid key={tl.id}>
          <Paper elevation={3}>
            <Todolist todolist={tl} />
          </Paper>
        </Grid>
      ))}
    </>
  );
});
