import { describe, test, expect, beforeEach } from 'vitest'
import { todoListsActions, tasksReducer, todoListsReducer } from '../slices';
import { v4 } from 'uuid';
import {Status} from "@/app/slices/appSlice.types.ts";
import {TaskPriorities, TaskStatuses} from "@/common/enums/enums.ts";
import {TodolistDomainType} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";
import {TasksType} from "@/features/Todolists/model/slices/tasksSlice.types.ts";

let todolistID_1: string;
let todolistID_2: string;
let startTasksState: TasksType;
let startTodoListsState: TodolistDomainType[];
let newTodoListTitle: string;
let entityStatus: Status;

describe('tasks reducer integration with todoLists', () => {
  beforeEach(() => {
    todolistID_1 = v4();
    todolistID_2 = v4();
    entityStatus = 'idle';
    newTodoListTitle = 'newTodoList';

    startTasksState = {
        [todolistID_1]: [
          {
            id: v4(),
            title: 'HTML&CSS',
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: new Date(),
            deadline: new Date(),
            todoListId: todolistID_1,
            order: 0,
            addedDate: new Date(),
            entityStatus,
          },
          {
            id: v4(),
            title: 'JS',
            status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: new Date(),
            deadline: new Date(),
            todoListId: todolistID_1,
            order: 0,
            addedDate: new Date(),
            entityStatus,
          },
          {
            id: v4(),
            title: 'ReactJS',
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: new Date(),
            deadline: new Date(),
            todoListId: todolistID_1,
            order: 0,
            addedDate: new Date(),
            entityStatus,
          },
        ],
        [todolistID_2]: [
          {
            id: v4(),
            title: 'Age',
            status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: new Date(),
            deadline: new Date(),
            todoListId: todolistID_2,
            order: 0,
            addedDate: new Date(),
            entityStatus,
          },
          {
            id: v4(),
            title: 'Weight',
            status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: new Date(),
            deadline: new Date(),
            todoListId: todolistID_2,
            order: 0,
            addedDate: new Date(),
            entityStatus,
          },
          {
            id: v4(),
            title: 'Height',
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: new Date(),
            deadline: new Date(),
            todoListId: todolistID_2,
            order: 0,
            addedDate: new Date(),
            entityStatus,
          },
        ],
    };

    startTodoListsState = [
      {
        id: todolistID_1,
        title: 'Main tasks',
        filter: 'all',
        entityStatus,
        addedDate: new Date(),
        order: 0,
      },
      {
        id: todolistID_2,
        title: 'Prepare to the exam',
        filter: 'active',
        entityStatus,
        addedDate: new Date(),
        order: 0,
      },
    ];
    newTodoListTitle = 'New TODO\`s title';
      });

    test('reducer taskList should ADD-NEW-TASKS-LIST (new empty array for tasks should be added when new todolist is added)', () => {
      const newTodoListId = v4();

      const newTodoList = {
        id: newTodoListId,
        title: newTodoListTitle,
        filter: 'all',
        addedDate: new Date(),
        order: 0,
      };
      const action = todoListsActions.addTodoList.fulfilled({ todolist: newTodoList }, 'requestId', { title: newTodoListTitle })
      const endTasksState = tasksReducer(startTasksState, action);
      const endTodoListsState = todoListsReducer(startTodoListsState, action);
      const newTodoListFromState = endTodoListsState.find(tl => tl.id === newTodoListId);

      // Check that the new tasks array exists with the correct ID
      expect(endTasksState[newTodoListId]).toBeDefined();
      expect(endTasksState[newTodoListId]).toEqual([]);
      expect(newTodoListFromState).toBeDefined();
    });

    test('reducer taskList should DELETE-TASKS-LIST (delete array of tasks with ID of deleted todoList)', () => {
      const action = todoListsActions.removeTodoList.fulfilled({ id: todolistID_2 }, 'requestId', { id: todolistID_2 })

      const endState = tasksReducer(startTasksState, action);
      const keys = Object.keys(endState);

      expect(keys.length).toBe(1);
      expect(endState[todolistID_2]).not.toBeDefined();
    });

    test('reducer taskList should ADD-TASKS-LIST WHEN TODOLISTS-ADDED (when todolists loaded from Rest API)', () => {
      const state = [
        {
          id: todolistID_1,
          title: 'Main tasks',
          filter: 'all',
          addedDate: new Date(),
          order: 0,
        },
        {
          id: todolistID_2,
          title: 'Prepare to the exam',
          filter: 'active',
          addedDate: new Date(),
          order: 0,
        },
      ];

      const action = todoListsActions.fetchTodolists.fulfilled({ todolists: state }, 'requestId', undefined);

      const endState = tasksReducer({}, action);

      const keys = Object.keys(endState);

      expect(keys.length).toBe(2);
      expect(endState[todolistID_1]).toStrictEqual([]);
      expect(endState[todolistID_2]).toStrictEqual([]);
    });
  });