[TODO-list API](https://social-network.samuraijs.com/docs?type=todolist#)

1. Vite added in commit: "refactor:change_CRA-to-VITE"
2. Creation of THUNKS changed to **createAppAsyncThunk** in commit: "feat: Creation of THUNKS changed to createAppAsyncThunk"
3. RTK 2.0 has a new way to write thunks [inside a slice](https://redux.js.org/usage/migrations/migrating-rtk-2#createslicereducers-callback-syntax-and-thunk-support) using the [create.asyncThunk API](https://redux-toolkit.js.org/api/createSlice#createasyncthunk).
   THUNKS created with **createAppAsyncThunk** moved inside the slices with using of *RTK 2.0* **buildCreateSlice**
   was done in commit: "feat: move THUNKS created with createAppAsyncThunk inside the slices - RTK 2.0"
4. Refactored Global loading and error handling to straightforward setting of loading status and errors from thunks.
   Just another implementation option since option **3** is more advanced.
   These changes are done in the commit: "feat: change global loading and error handling to straightforward variant from thunks"
5. Refactored from Formik to React Hook Form with Zod validation in commit: "feat: change Formik to React Hook Form wit Zod validation"
6. Refactor Bearer token via Cookies using with "withCredentials: true" in axios instance to Bearer token with instance.interceptors
   and saving Bearer token to localStorage in commit: "feat: set and get Bearer token to localStorage using instance.interceptors"
7. Add Zod validation for API responses in commit: "feat: add Zod validation for API responses"
8. Refactor RTK 2.0 - THUNKS created with **createAppAsyncThunk** inside the slices to **RTK query** *Server State*
   in commit: "feat: change from THUNKS created with createAppAsyncThunk inside the slices (RTK 2.0) to RTK query"
9. Version 8 without unused slices and comments after refactoring to RTK query in commit: "refactor: delete comments and unused slices after refactoring to RTK query"
10. Add isLoading for global LinearProgress and Todolists/Tasks Query Loading State to show TodolistSkeleton/TasksSkeleton
   in commit: "feat: add global isLoading and Todolists/Tasks Query Loading State to show TodolistSkeleton/TasksSkeleton"
11. Advanced cache tags in commit: "feat: refactor to advanced cache tags in provideTags and invalidateTags"
12. Add optimistic update to delete TodoList in commit: "feat: add optimistic update to delete TodoList"
13. Add pagination to TasksList with optimistic update and **cachedArgsForQuery** for correct handling of different params in URI
    (avoids faults in deleting of tasks on different pages from first due to changing of URI query params)
    in commit: "feat: add pagination with optimistic update and correct handling of all query Params" - see **15**
14. Refactor from **Data** to **Declarative** *mode* React Router Dom
    in commit: "fix: add redirect from ROOT to TODO path after change Data to Declarative mode React Router Dom"
15. Fixed bug in updateTask optimistic update caused by the absence of the **count** URI query parameter in **cachedArgsForQuery** handling
    in commit -m "fix: updateTask optimistic update caused by the absence of the count URI query parameter in cachedArgsForQuery handling"
16. Add show/hide password in Login page in commit: "feat: add show/hide password in Login page"
17. A **CAPTCHA** has been added for repeated incorrect password entries in commit: "feat: add Captcha if several times the incorrect password is entered"
18. Add *drag & drop* for Todolist component with **dnd-kit** in commit: "feat: add drag & drop Todolist component with dnd-kit"
