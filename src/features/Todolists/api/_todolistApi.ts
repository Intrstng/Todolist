import {BaseResponse, instance} from "@/common";
import {CreateTodolistResponse, DataType, GetTodolistsResponse} from "@/features/Todolists/api/todolistApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {TodolistDomainType, TodolistType} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";
import {updateTaskStatus} from "@/utils/updateTaskStatus.ts";
import {updateTodoListEntityStatus} from "@/utils/updateTodoListEntityStatus.ts";

export const _todolistApi = {
  getTodolists() {
    return instance.get<GetTodolistsResponse>('/todo-lists');
  },
  createTodolist(data: DataType) {
    // return instance.post<BaseResponse<{ item: TodolistType }>>('/todo-lists', data);
    return instance.post<CreateTodolistResponse>('/todo-lists', data);
  },
  updateTodolist(todoID: string, data: DataType) {
    return instance.put<BaseResponse>(`/todo-lists/${todoID}`, data);
  },
  deleteTodolist(todoID: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todoID}`);
  },
};


export const _todolistsApi = baseApi.injectEndpoints({
  // reducerPath: 'todolistsApi',
  // tagTypes: ["Todolist"],
  // baseQuery: fetchBaseQuery({
  //   baseUrl: import.meta.env.VITE_BASE_URL,
  //   headers: {
  //     'API-KEY': import.meta.env.VITE_API_KEY,
  //   },
  //   prepareHeaders: headers => {
  //     headers.set('Authorization', `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
  //   },
  // }),
  endpoints: (builder) => ({
    // getTodolists: builder.query<Todolist[], void>({
    //   query: (_arg) => {
    //     return {
    //       method: 'get',
    //       url: "/todo-lists",
    //     }
    //   },

    // Только для Get сокращенная запись вместо написанного выше
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

      // Todolist entity status handling
      async onQueryStarted(todolistID, { dispatch, queryFulfilled }) {
        try {
          // ✅ Set todolist to loading
          updateTodoListEntityStatus(dispatch, todolistID, 'loading');
          await queryFulfilled;
          // ✅ Set todolist to succeeded
          updateTodoListEntityStatus(dispatch, todolistID, 'succeeded');
        } catch (error) {
          // ✅ Set todolist to failed
          updateTodoListEntityStatus(dispatch, todolistID, 'failed');
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
  useLazyGetTodolistsQuery,
  useAddTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = _todolistsApi