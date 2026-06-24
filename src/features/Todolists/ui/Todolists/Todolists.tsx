import {memo} from 'react';
import {Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {Todolist} from './TodolistItem/Todolist';
import {useAppSelector} from '@/app/store';
import {Navigate} from 'react-router-dom';
import {CreateItemForm} from "@/common/components";
import {authIsLoggedInSelector} from "@/app/slices/appSlice.ts";
import {useGetTodolistsQuery} from "@/features/Todolists/api/todolistApi.ts";
import {TodolistSkeleton} from "@/features/Todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton.tsx";
import Box from "@mui/material/Box";
import {SKELETON_GALLERY} from "@/common/constants";

export const Todolists = memo(() => {
  const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);
  const { data: todoLists, isLoading } = useGetTodolistsQuery(undefined, { skip: !isLoggedIn });

  if (!isLoggedIn) {
    // Conditional after ALL hooks
    return <Navigate to={'/login'} />;
  }
  // Добавить эти редиректы нужно непосредственно перед return, то есть после всех хуков,
  // которые используются внутри компонент, иначе будет нарушено правило работы с хуками, говорящее,
  // что нельзя использовать хуки внутри компоненты в условной логике.

  if (isLoading) {
    return (
        <Box style={{ gap: "2rem", display: 'flex' }}>
          {Array(SKELETON_GALLERY)
              .fill(null)
              .map((_, id) => (
                  <TodolistSkeleton key={id} />
              ))}
        </Box>
    )
  }

  return (
    <>
      <CreateItemForm/>
      {todoLists?.map((tl) => (
        <Grid key={tl.id}>
          <Paper elevation={3}>
            <Todolist todolist={tl} />
          </Paper>
        </Grid>
      ))}
    </>
  );
});
