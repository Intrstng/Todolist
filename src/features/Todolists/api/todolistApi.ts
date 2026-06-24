import {BaseResponse} from "@/common";
import {CreateTodolistResponse, DataType} from "@/features/Todolists/lib/types/todolistApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {TodolistDomainType, TodolistType} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodolists: builder.query<TodolistDomainType[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: TodolistType[]): TodolistDomainType[] =>
          todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),

      providesTags: ["Todolist"],
    }),

    addTodolist: builder.mutation<CreateTodolistResponse, DataType>({
      query: ({ title }) => {
        return {
          method: "post",
          url: "/todo-lists",
          body: { title },
        }
      },
      invalidatesTags: ["Todolist"],
    }),

    deleteTodolist: builder.mutation<BaseResponse, string>({
      query: (todolistID) => {
        return {
          method: "delete",
          url: `/todo-lists/${todolistID}`,
        }
      },

      // // Todolist entity status handling
      // async onQueryStarted(todolistID, { dispatch, queryFulfilled }) {
      //   try {
      //     // ✅ Set todolist to loading
      //     updateTodoListEntityStatus(dispatch, todolistID, 'loading');
      //     await queryFulfilled;
      //     // ✅ Set todolist to succeeded
      //     updateTodoListEntityStatus(dispatch, todolistID, 'succeeded');
      //   } catch (error) {
      //     // ✅ Set todolist to failed
      //     updateTodoListEntityStatus(dispatch, todolistID, 'failed');
      //   }
      // },

      async onQueryStarted(todolistID: string, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
              const index = state.findIndex((todolist) => todolist.id === todolistID)
              if (index !== -1) {
                state.splice(index, 1)
              }
            }),
        )
        try {
          // ✅ Set todolist to loading
          // updateTodoListEntityStatus(dispatch, todolistID, 'loading'); // удалено т.к. не дизейбл тудулиста, а сразу его удаление
          await queryFulfilled;
          // ✅ Set todolist to succeeded
          // updateTodoListEntityStatus(dispatch, todolistID, 'succeeded'); // удалено т.к. не дизейбл тудулиста, а сразу его удаление
        } catch {
          patchResult.undo()
          // updateTodoListEntityStatus(dispatch, todolistID, 'failed'); // удалено т.к. не дизейбл тудулиста, а сразу его удаление
        }
      },

      invalidatesTags: ["Todolist"],
    }),

    changeTodolistTitle: builder.mutation<BaseResponse, { id: string; data: DataType }>({
      query: ({ id, data }) => {
        return {
          method: "put",
          url: `/todo-lists/${id}`,
          body: data, // { title: data.title }
        }
      },
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistsApi