import {BaseResponse} from "@/common";
import {
  AddTaskArg,
  CreateTaskResponse,
  DeleteTaskArg,
  GetTasksRequestArgs,
  PatchCollection,
  ResponseGetTasksType,
  UpdateTaskArg,
  UpdateTaskResponse
} from "@/features/Todolists/lib/types/taskApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {updateTaskStatus} from "@/utils/updateTaskStatus";
import {updateTodoListEntityStatus} from "@/utils/updateTodoListEntityStatus.ts";
import { UniqueIdentifier } from "@dnd-kit/abstract";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<ResponseGetTasksType, GetTasksRequestArgs>({
      // query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      query: ({ todolistID, params }) => ({
        url: `todo-lists/${todolistID}/tasks`,
        params,
      }),

      transformResponse: (response: ResponseGetTasksType, _meta, _arg) => {
        // Transform tasks by adding entityStatus
        return {
          ...response,
          items: response.items.map((task) => ({
            ...task,
            entityStatus: 'idle',
          })),
        };
      },

      // Вариант 1 изначальный (запросы на обновление всех тасок)
      // providesTags: ["Task"],

      // Вариант 2 на запрос таски только измененной, а не всех
      // providesTags: (res) => (res ? res.items.map(({ id }) => ({ type: "Task", id })) : ["Task"]),

      // Вариант 3 на запрос таски только измененной, а не всех
      // providesTags: (res, _err, todolistId) =>
      //   res
      //     ? [...res.items.map(({ id }) => ({ type: "Task", id }) as const), { type: "Task", id: todolistId }]
      //     : ["Task"],

      // Вариант 4 - упрощенный вариант - завязка на todolistId
      providesTags: (_res, _err, { todolistID }) => [{ type: "Task", id: todolistID }],
    }),

    createTask: builder.mutation<CreateTaskResponse, { data: AddTaskArg }> ({
      query: ({ data }) => {
        return {
          method: 'post',
          url: `/todo-lists/${data.todolistID}/tasks`,
          body: { title: data.title }
        }
      },
      // The same logic in getTasks
      // transformResponse: (response: CreateTaskResponse, _meta, _arg) => {
      //   // Transform tasks by adding entityStatus
      //   return {
      //     ...response,
      //     data: {
      //       ...response.data,
      //       item: {
      //         ...response.data.item,
      //         entityStatus: "loading" as Status, // Add status to nested item
      //       }
      //     }
      //   };
      // },

      // Todolist entity status handling (Disable todolist during creation of the task)
      async onQueryStarted({ data }, { dispatch, queryFulfilled }) {
        const { todolistID } = data;
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

      // Для Варианта 3
      // invalidatesTags: res => [{ type: 'Task', id: res ? res.data.item.id : 'LIST' }],
      // Для Варианта 4
      invalidatesTags: (_res, _err, { data }) => [{ type: "Task", id: data.todolistID }],
    }),

    updateTask: builder.mutation<UpdateTaskResponse, { data: UpdateTaskArg }> ({
      query: ({ data }) => {
        return {
          method: 'put',
          url: `/todo-lists/${data.todolistID}/tasks/${data.taskID}`,
          body: data.model
        }
      },

      async onQueryStarted({ data }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")
        const { todolistID, taskID, model } = data;

        let patchResults: PatchCollection[] = []
        cachedArgsForQuery.forEach(({ params }) => {
          patchResults.push(
              dispatch(
                  tasksApi.util.updateQueryData(
                      "getTasks",
                      { todolistID, params: { count: params.count, page: params.page } },
                      (state) => {
                        const index = state.items.findIndex((task) => task.id === taskID)
                        if (index !== -1) {
                          state.items[index] = { ...state.items[index], ...model }
                        }
                      },
                  ),
              ),
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },


      // Для Варианта 3
      // invalidatesTags: (_res, _err, { data }) => [{ type: "Task", id: data.taskID }],
      // Для Варианта 4
      invalidatesTags: (_res, _err, { data }) => [{ type: "Task", id: data.todolistID }],
    }),

    deleteTask: builder.mutation<BaseResponse, { data: DeleteTaskArg }> ({
      query: ({ data }) => {
        return {
          method: 'delete',
          url: `/todo-lists/${data.todolistID}/tasks/${data.taskID}`,
        }
      },
      // Task entity status handling
      async onQueryStarted({ data }, { dispatch, queryFulfilled }) {
        const { todolistID, taskID } = data;
        try {
          // ✅ Set task to loading
          updateTaskStatus(dispatch, todolistID, taskID, 'loading');
          await queryFulfilled;
          // We can not add next line because if "succeeded" the task will be deleted
          // updateTaskStatus(dispatch, todolistID, taskID, 'succeeded');
        } catch (error) {
          // ✅ Set task to failed
          updateTaskStatus(dispatch, todolistID, taskID, 'failed');
        }
      },

      // Для Варианта 3
      // invalidatesTags: (_res, _err, { data }) => [{ type: "Task", id: data.taskID }],
      // Для Варианта 4
      invalidatesTags: (_res, _err, { data }) => [{ type: "Task", id: data.todolistID }],
    }),

    tasksReorder: builder.mutation<
        BaseResponse,
        { todolistID: string; taskID: UniqueIdentifier; putAfterItemId: string | null }
    >({
      query: ({ todolistID, taskID, putAfterItemId }) => ({
        url: `todo-lists/${todolistID}/tasks/${taskID}/reorder`,
        method: "PUT",
        body: { putAfterItemId },
      }),
      invalidatesTags: (_res, _err, { todolistID }) => [{ type: "Task", id: todolistID }],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useTasksReorderMutation,
} = tasksApi
