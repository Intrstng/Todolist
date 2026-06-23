import {BaseResponse, instance} from "@/common";
import {
  AddTaskArg,
  CreateTaskResponse,
  DeleteTaskArg,
  ResponseGetTasksType,
  UpdateTaskArg,
  UpdateTaskResponse,
  UpdateTaskType
} from "@/features/Todolists/api/taskApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";
import {updateTaskStatus} from "@/utils/updateTaskStatus";
import {updateTodoListEntityStatus} from "@/utils/updateTodoListEntityStatus.ts";

export const _taskApi = {
  getAllTasks(todoID: string) {
    return instance.get<ResponseGetTasksType>(`/todo-lists/${todoID}/tasks`);
  },
  createTask(todoID: string, data: { title: string }) {
    // return instance.post<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todoID}/tasks`, data);
    return instance.post<CreateTaskResponse>(`/todo-lists/${todoID}/tasks`, data);
  },
  updateTask(todoID: string, taskID: string, data: UpdateTaskType) {
   // return instance.put<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todoID}/tasks/${taskID}`, data);
    return instance.put<UpdateTaskResponse>(`/todo-lists/${todoID}/tasks/${taskID}`, data);
  },
  deleteTask(todoID: string, taskID: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todoID}/tasks/${taskID}`);
  },
};


export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<ResponseGetTasksType, string>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,

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

      providesTags: ["Task"],
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

      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation<UpdateTaskResponse, { data: UpdateTaskArg }> ({
      query: ({ data }) => {
        return {
          method: 'put',
          url: `/todo-lists/${data.todolistID}/tasks/${data.taskID}`,
          body: data.model
        }
      },
      invalidatesTags: ["Task"],
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

      invalidatesTags: ["Task"],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = tasksApi