import {memo, useEffect, useRef, useState} from 'react';
import {Todolist} from './TodolistItem/Todolist';
import {authIsLoggedInSelector} from "@/app/slices/appSlice.ts";
import {useGetTodolistsQuery, useTodoListsReorderMutation} from "@/features/Todolists/api/todolistApi.ts";
import {TodolistSkeleton} from "@/features/Todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton.tsx";
import Box from "@mui/material/Box";
import {SKELETON_GALLERY} from "@/common/constants";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";
import {move} from "@dnd-kit/helpers"
import {Data, Droppable} from "@dnd-kit/abstract"
import {DragDropProvider, DragEndEvent} from "@dnd-kit/react"

export const Todolists = memo(() => {
  const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);
  const { data: todolists, isLoading } = useGetTodolistsQuery(undefined, { skip: !isLoggedIn });
  
  const [todoListsReorder] = useTodoListsReorderMutation()
  const [items, setItems] = useState(todolists ?? [])
  const isDragging = useRef(false)

  useEffect(() => {
    if (todolists && !isDragging.current) {
      setItems(todolists)
    }
  }, [todolists])

  const setTodolistsOrder = (
      todolists: TodolistDomainType[] | undefined,
      event: DragEndEvent,
      target: Droppable<Data> | null,
  ) => {
    if (todolists) {
      const sortedNewTodolists: TodolistDomainType[] = move(todolists, event)
      // console.log(move(todolists, event))

      const targetId = target?.id
      if (!targetId) return

      const targetIndex = sortedNewTodolists.findIndex((tl) => tl.id === targetId)
      if (targetIndex === -1) return

      if (sortedNewTodolists.length === 1 || targetIndex === 0) {
        todoListsReorder({ todolistID: targetId, putAfterItemId: null })
      } else {
        const todolistPlacedBeforeTargetTodolist = sortedNewTodolists[targetIndex - 1]
        const prevTodolistId = todolistPlacedBeforeTargetTodolist.id
        todoListsReorder({ todolistID: targetId, putAfterItemId: prevTodolistId })
      }
    }
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
      <DragDropProvider
          onDragStart={() => {
            isDragging.current = true
          }}
          onDragEnd={(event) => {
            isDragging.current = false

            const { target } = event.operation

            if (event.canceled) {
              // Reset to server state on cancel
              setItems(todolists ?? [])
              return
            }
            setItems((items) => move(items, event))
            setTodolistsOrder(items, event, target)
          }}
      >
      {todolists?.map((tl, sortIndex) => (
            <Todolist todolist={tl} key={tl.id} sortIndex={sortIndex}/>
      ))}
      </DragDropProvider>
  );
});
