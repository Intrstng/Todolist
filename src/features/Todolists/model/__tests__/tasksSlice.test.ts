import { describe, test, expect, beforeEach } from 'vitest'
import { v4 } from 'uuid'
import {tasksActions, tasksReducer, TasksType, UpdateTaskDomainModelType} from "@/features/Todolists/model/slices"
import { Status } from "@/app/slices/appSlice.types";
import {TaskPriorities, TaskStatuses} from "@/common/enums/enums.ts";
import {TaskDomainType} from "@/features/Todolists/api/taskApi.types.ts";

let todolistID_1: string;
let todolistID_2: string;
let tasksState: TasksType;
let newTitle_1: string;
let newTitle_2: string;
let taskID_1: string;
let taskID_2: string;
let date: Date;
let entityStatus: Status;

describe('tasks reducer', () => {
  beforeEach(() => {
    todolistID_1 = v4();
    todolistID_2 = v4();
    newTitle_1 = 'New-task-1';
    newTitle_2 = 'New-task-2';
    taskID_1 = '1';
    taskID_2 = '4';
    date = new Date();
    entityStatus = 'idle';

    tasksState = {
        [todolistID_1]: [
          {
            id: '1',
            title: 'HTML&CSS',
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: date,
            deadline: date,
            todoListId: todolistID_1,
            order: 0,
            addedDate: date,
            entityStatus,
          },
          {
            id: '2',
            title: 'JS',
            status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: date,
            deadline: date,
            todoListId: todolistID_1,
            order: 0,
            addedDate: date,
            entityStatus,
          },
          {
            id: '3',
            title: 'ReactJS',
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: date,
            deadline: date,
            todoListId: todolistID_1,
            order: 0,
            addedDate: date,
            entityStatus,
          },
        ],
        [todolistID_2]: [
          {
            id: '4',
            title: 'Age',
            status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: date,
            deadline: date,
            todoListId: todolistID_2,
            order: 0,
            addedDate: date,
            entityStatus,
          },
          {
            id: '5',
            title: 'Weight',
            status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: date,
            deadline: date,
            todoListId: todolistID_2,
            order: 0,
            addedDate: date,
            entityStatus,
          },
          {
            id: '6',
            title: 'Height',
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: date,
            deadline: date,
            todoListId: todolistID_2,
            order: 0,
            addedDate: date,
            entityStatus,
          },
        ],
    };
  });

  test('reducer taskList should ADD-TASK', () => {
    const newState_1 = tasksReducer(tasksState, tasksActions.addTask.fulfilled({ task: tasksState[todolistID_1][0] }, 'requestId', { todolistID: todolistID_1, title: newTitle_1 }))
    const newState_2 = tasksReducer(tasksState, tasksActions.addTask.fulfilled({ task: tasksState[todolistID_2][0] }, 'requestId', { todolistID: todolistID_2, title: newTitle_2 }))

    expect(tasksState[todolistID_1].length).toBe(3);
    expect(tasksState[todolistID_2].length).toBe(3);
    expect(newState_1[todolistID_1].length).toBe(4);
    expect(newState_2[todolistID_2].length).toBe(4);
    expect(newState_1[todolistID_1][0].id).toBeDefined();
    expect(newState_2[todolistID_2][0].id).toBeDefined();
    expect(newState_1[todolistID_1][0].title).toBe(tasksState[todolistID_1][0].title);
    expect(newState_2[todolistID_2][0].title).toBe(tasksState[todolistID_2][0].title);
    expect(newState_1[todolistID_1][0].status).toBe(TaskStatuses.New);
    expect(newState_2[todolistID_2][0].status).toBe(TaskStatuses.Completed);
  });

  test('reducer taskList should REMOVE-TASK', () => {
    // action
    const newState_1 = tasksReducer(tasksState, tasksActions.removeTask.fulfilled({ todolistID: todolistID_1, taskID: taskID_1 }, 'requestId', { todolistID: todolistID_1, taskID: taskID_1 }))
    const newState_2 = tasksReducer(tasksState, tasksActions.removeTask.fulfilled({ todolistID: todolistID_2, taskID: taskID_2 }, 'requestId', { todolistID: todolistID_2, taskID: taskID_2 }))

    // expectation
    expect(newState_1[todolistID_1].length).toBe(2); // Should be 2 after removal
    expect(newState_1[todolistID_2].length).toBe(3); // Should still be 3

    expect(newState_1).toEqual({
      [todolistID_1]: [
        {
          id: '2',
          title: 'JS',
          status: TaskStatuses.Completed,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_1,
          order: 0,
          addedDate: date,
          entityStatus,
        },
        {
          id: '3',
          title: 'ReactJS',
          status: TaskStatuses.New,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_1,
          order: 0,
          addedDate: date,
          entityStatus,
        },
      ],
      [todolistID_2]: [
        {
          id: '4',
          title: 'Age',
          status: TaskStatuses.Completed,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_2,
          order: 0,
          addedDate: date,
          entityStatus,
        },
        {
          id: '5',
          title: 'Weight',
          status: TaskStatuses.Completed,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_2,
          order: 0,
          addedDate: date,
          entityStatus,
        },
        {
          id: '6',
          title: 'Height',
          status: TaskStatuses.New,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_2,
          order: 0,
          addedDate: date,
          entityStatus,
        },
      ],
    });

    expect(newState_2[todolistID_1].length).toBe(3); // Should still be 3
    expect(newState_2[todolistID_2].length).toBe(2); // Should be 2 after removal

    expect(newState_2).toEqual({
      [todolistID_1]: [
        {
          id: '1',
          title: 'HTML&CSS',
          status: TaskStatuses.New,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_1,
          order: 0,
          addedDate: date,
          entityStatus,
        },
        {
          id: '2',
          title: 'JS',
          status: TaskStatuses.Completed,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_1,
          order: 0,
          addedDate: date,
          entityStatus,
        },
        {
          id: '3',
          title: 'ReactJS',
          status: TaskStatuses.New,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_1,
          order: 0,
          addedDate: date,
          entityStatus,
        },
      ],
      [todolistID_2]: [
        {
          id: '5',
          title: 'Weight',
          status: TaskStatuses.Completed,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_2,
          order: 0,
          addedDate: date,
          entityStatus,
        },
        {
          id: '6',
          title: 'Height',
          status: TaskStatuses.New,
          description: '',
          priority: TaskPriorities.Low,
          startDate: date,
          deadline: date,
          todoListId: todolistID_2,
          order: 0,
          addedDate: date,
          entityStatus,
        },
      ],
    });
  });

  test('reducer taskList should UPDATE-TASK status', () => {
    const newTaskModel_1: UpdateTaskDomainModelType = {
      status: TaskStatuses.Completed,
    };
    const newTaskModel_2: UpdateTaskDomainModelType = {
      status: TaskStatuses.New,
    };

    const newState_1 = tasksReducer(
        tasksState,
        tasksActions.updateTask.fulfilled({
          todolistID: todolistID_1,
          taskID: taskID_1,
          model: newTaskModel_1,
        }, 'requestId', {
          todolistID: todolistID_1,
          taskID: taskID_1,
          model: newTaskModel_1,
        })
    );

    const newState_2 = tasksReducer(
        tasksState,
        tasksActions.updateTask.fulfilled({
          todolistID: todolistID_2,
          taskID: taskID_2,
          model: newTaskModel_2,
        }, 'requestId', {
          todolistID: todolistID_2,
          taskID: taskID_2,
          model: newTaskModel_2,
        })
    );

    expect(tasksState[todolistID_1].find((t) => t.id === taskID_1)?.status).toBe(TaskStatuses.New);
    expect(newState_1[todolistID_1].find((t) => t.id === taskID_1)?.status).toBe(TaskStatuses.Completed);
    expect(tasksState[todolistID_2].find((t) => t.id === taskID_2)?.status).toBe(TaskStatuses.Completed);
    expect(newState_2[todolistID_2].find((t) => t.id === taskID_2)?.status).toBe(TaskStatuses.New);
  });

  test('reducer taskList should UPDATE-TASK title', () => {
    const newTaskModel_1: UpdateTaskDomainModelType = {
      title: newTitle_1,
    };
    const newTaskModel_2: UpdateTaskDomainModelType = {
      title: newTitle_2,
    };

    const newState_1 = tasksReducer(
        tasksState,
        tasksActions.updateTask.fulfilled({
          todolistID: todolistID_1,
          taskID: taskID_1,
          model: newTaskModel_1,
        }, 'requestId', {
          todolistID: todolistID_1,
          taskID: taskID_1,
          model: newTaskModel_1,
        })
    );

    const newState_2 = tasksReducer(
        tasksState,
        tasksActions.updateTask.fulfilled({
          todolistID: todolistID_2,
          taskID: taskID_2,
          model: newTaskModel_2,
        }, 'requestId', {
          todolistID: todolistID_2,
          taskID: taskID_2,
          model: newTaskModel_2,
        })
    );

    expect(tasksState[todolistID_1].find((t) => t.id === taskID_1)?.title).toBe('HTML&CSS');
    expect(newState_1[todolistID_1].find((t) => t.id === taskID_1)?.title).toBe(newTitle_1);
    expect(tasksState[todolistID_2].find((t) => t.id === taskID_2)?.title).toBe('Age');
    expect(newState_2[todolistID_2].find((t) => t.id === taskID_2)?.title).toBe(newTitle_2);
  });

  test('reducer taskList should SET-TASKS (FROM REST API)', () => {
    const newTasks_1: TaskDomainType[] = [
      {
        id: '1',
        title: 'newTask',
        status: TaskStatuses.New,
        description: '',
        priority: TaskPriorities.Low,
        startDate: date,
        deadline: date,
        todoListId: todolistID_1,
        order: 0,
        addedDate: date,
        entityStatus,
      },
      {
        id: '2',
        title: 'newTask_2',
        status: TaskStatuses.New,
        description: '',
        priority: TaskPriorities.Low,
        startDate: date,
        deadline: date,
        todoListId: todolistID_1,
        order: 0,
        addedDate: date,
        entityStatus,
      },
    ];
    const newTasks_2: TaskDomainType[] = [
      {
        id: '1',
        title: 'newTask',
        status: TaskStatuses.New,
        description: '',
        priority: TaskPriorities.Low,
        startDate: date,
        deadline: date,
        todoListId: todolistID_1,
        order: 0,
        addedDate: date,
        entityStatus,
      },
      {
        id: '2',
        title: 'newTask_2',
        status: TaskStatuses.New,
        description: '',
        priority: TaskPriorities.Low,
        startDate: date,
        deadline: date,
        todoListId: todolistID_1,
        order: 0,
        addedDate: date,
        entityStatus,
      },
      {
        id: '3',
        title: 'newTask_3',
        status: TaskStatuses.New,
        description: '',
        priority: TaskPriorities.Low,
        startDate: date,
        deadline: date,
        todoListId: todolistID_1,
        order: 0,
        addedDate: date,
        entityStatus,
      },
    ];

    const newState_1 = tasksReducer(tasksState, tasksActions.fetchTasks.fulfilled({ todolistID: todolistID_1, tasks: newTasks_1 }, 'requestId', todolistID_1))
    const newState_2 = tasksReducer(tasksState, tasksActions.fetchTasks.fulfilled({ todolistID: todolistID_2, tasks: newTasks_2 }, 'requestId', todolistID_2))

    expect(tasksState[todolistID_1].length).toBe(3);
    expect(tasksState[todolistID_2].length).toBe(3);
    expect(newState_1[todolistID_1].length).toBe(2);
    expect(newState_2[todolistID_2].length).toBe(3);
  });
});