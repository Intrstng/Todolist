import { describe, test, expect, beforeEach } from 'vitest'
import { TasksType, TodolistDomainType, todoListsActions, tasksReducer, todoListsReducer } from '../slices';
import { v4 } from 'uuid';
import { Status } from '@/app/slices/appSlice';
import { TaskPriorities, TaskStatuses } from "@/api/task-api.ts";

let todolistID_1: string;
let todolistID_2: string;
let startTasksState: { tasks: TasksType };
let startTodoListsState: TodolistDomainType[];
let newTodoListTitle: string;
let entityStatus: Status;

describe('tasks reducer integration with todoLists', () => {
  beforeEach(() => {
    todolistID_1 = v4();
    todolistID_2 = v4();
    entityStatus = 'idle';

    startTasksState = {
      tasks: {
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
      }
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
      const newTodoList = {
        id: todolistID_1,
        title: 'newTodoList',
        filter: 'all',
        addedDate: new Date(),
        order: 0,
      };
      const action = todoListsActions.addTodolist({ newTodolistData: newTodoList });
      const endTasksState = tasksReducer(startTasksState, action);
      const endTodoListsState = todoListsReducer(startTodoListsState, action);
      const keys = Object.keys(endTasksState.tasks);
      const idFromTasks = keys[0];
      const idFromTodoLists = endTodoListsState[endTodoListsState.length - 1].id;

      expect(idFromTasks).toBe(action.payload.newTodolistData.id);
      expect(idFromTodoLists).toBe(action.payload.newTodolistData.id);
    });

    test('reducer taskList should DELETE-TASKS-LIST (delete array of tasks with ID of deleted todoList)', () => {
      const action = todoListsActions.removeTodolist({ todolistID: todolistID_2 });
      const endState = tasksReducer(startTasksState, action);
      const keys = Object.keys(endState.tasks);

      expect(keys.length).toBe(1);
      expect(endState.tasks[todolistID_2]).not.toBeDefined();
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

      const action = todoListsActions.setTodoLists({ todolists: state });
      const endState = tasksReducer({ tasks: {} }, action);

      const keys = Object.keys(endState.tasks);

      expect(keys.length).toBe(2);
      expect(endState.tasks[todolistID_1]).toStrictEqual([]);
      expect(endState.tasks[todolistID_2]).toStrictEqual([]);
    });
  });