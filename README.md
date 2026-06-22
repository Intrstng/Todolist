[TODO-list API](https://social-network.samuraijs.com/docs?type=todolist#)

1. Vite added in commit: "refactor:change_CRA-to-VITE"
2. Creation of THUNKS changed to **createAppAsyncThunk** in commit: "feat: Creation of THUNKS changed to createAppAsyncThunk"
3. RTK 2.0 has a new way to write thunks [inside a slice](https://redux.js.org/usage/migrations/migrating-rtk-2#createslicereducers-callback-syntax-and-thunk-support) using the [create.asyncThunk API](https://redux-toolkit.js.org/api/createSlice#createasyncthunk).
   THUNKS created with **createAppAsyncThunk** moved inside the slices with usinng of *RTK 2.0* **buildCreateSlice**
   was done in commit: "feat: move THUNKS created with createAppAsyncThunk inside the slices - RTK 2.0"
4. Refactored Global loading and error handling to straightforward setting of loading status and errors from thunks.
   Just another implementation option since option **3** is more advanced.
   These changes are done in the commit: "feat: change global loading and error handling to straightforward variant from thunks"
5. Refactored from Formik to React Hook Form with Zod validation in commit: "feat: change Formik to React Hook Form wit Zod validation"
6. Refactor Bearer token via Cookies using with "withCredentials: true" in axios instance to Bearer token with instance.interceptors
   and saving Bearer token to localStorage in commit: "feat: set and get Bearer token to localStorage using instance.interceptors"

    