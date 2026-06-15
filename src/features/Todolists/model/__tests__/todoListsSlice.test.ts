import { describe, test, expect, beforeEach } from 'vitest'
import { todoListsActions, FilterValuesType, TodolistDomainType, todoListsReducer } from '../slices';
import { v4 } from 'uuid';
import { Status } from '@/app/slices/appSlice';

let todolistID_1: string;
let todolistID_2: string;
let state: TodolistDomainType[];
let todolistTitle: string;
let entityStatus: Status;
let newFilter_1: FilterValuesType;
let newFilter_2: FilterValuesType;
let entityStatus_1: Status;
let entityStatus_2: Status;

describe('todoLists reducer', () => {
  beforeEach(() => {
    todolistID_1 = v4();
    todolistID_2 = v4();
    todolistTitle = 'New todolist`s name';
    newFilter_1 = 'active';
    newFilter_2 = 'completed';
    entityStatus = 'idle';
    entityStatus_1 = 'loading';
    entityStatus_2 = 'succeeded';
    state = [
      {
        id: todolistID_1,
        title: 'Main tasks',
        filter: 'all',
        entityStatus: entityStatus,
        addedDate: new Date(),
        order: 0,
      },
      {
        id: todolistID_2,
        title: 'Prepare to the exam',
        filter: 'active',
        entityStatus: entityStatus,
        addedDate: new Date(),
        order: 0,
      },
    ];
  });

  test('reducer todoLists should CHANGE FILTER', () => {
    const newState_1 = todoListsReducer(
        state,
        todoListsActions.changeFilter({ todolistID: todolistID_1, value: newFilter_1 }),
    );
    const newState_2 = todoListsReducer(
        state,
        todoListsActions.changeFilter({ todolistID: todolistID_2, value: newFilter_2 }),
    );

    expect(state.filter((tl) => tl.id === todolistID_1)[0].filter).toBe('all');
    expect(newState_1.filter((tl) => tl.id === todolistID_1)[0].filter).toBe(newFilter_1);

    expect(state.filter((tl) => tl.id === todolistID_2)[0].filter).toBe('active');
    expect(newState_2.filter((tl) => tl.id === todolistID_2)[0].filter).toBe(newFilter_2);
  });

  test('reducer todoLists should ADD-TODOLIST', () => {
    const newTodoList = {
      id: todolistID_1,
      title: 'newTodoList',
      filter: 'all',
      addedDate: new Date(),
      order: 0,
    };
    const newState = todoListsReducer(state, todoListsActions.addTodolist({ newTodolistData: newTodoList }));

    expect(state.length).toBe(2);
    expect(newState.length).toBe(3);
    expect(newState[2].id).toBeDefined();
    expect(newState[2].title).toBe(newTodoList.title);
    expect(newState[2].filter).toBe('all');
  });

  test('reducer todoLists should REMOVE-TODOLIST', () => {
    const newState_1 = todoListsReducer(state, todoListsActions.removeTodolist({ todolistID: todolistID_1 }));
    const newState_2 = todoListsReducer(state, todoListsActions.removeTodolist({ todolistID: todolistID_2 }));

    expect(state.length).toBe(2);
    expect(newState_1.length).toBe(1);
    expect(newState_2.length).toBe(1);

    expect(newState_1[0]).toEqual(state[1]);
    expect(newState_2[0]).toEqual(state[0]);
  });

  test('reducer todoLists should UPDATE-TODOLIST (change todoLists title)', () => {
    const newState_1 = todoListsReducer(
        state,
        todoListsActions.updateTodolist({ todolistID: todolistID_1, newTitle: todolistTitle }),
    );
    const newState_2 = todoListsReducer(
        state,
        todoListsActions.updateTodolist({ todolistID: todolistID_2, newTitle: todolistTitle }),
    );

    expect(state[0].title).toBe('Main tasks');
    expect(state[1].title).toBe('Prepare to the exam');

    expect(newState_1[0].title).toBe(todolistTitle);
    expect(newState_2[1].title).toBe(todolistTitle);
  });

  test('reducer todoLists should SET-TODOLISTS to the state (action creator for REST API request)', () => {
    const newState = todoListsReducer([], todoListsActions.setTodoLists({ todolists: state }));

    expect(newState.length).toBe(2);
    expect(newState[0].title).toBe('Main tasks');
    expect(newState[0].filter).toBe('all');
    expect(newState[1].filter).toBe('all');
  });

  test('reducer todoLists should CHANGE-TODOLIST-ENTITY-STATUS', () => {
    const newState_1 = todoListsReducer(
        state,
        todoListsActions.changeTodoListsEntityStatus({
          todolistID: todolistID_1,
          entityStatus: entityStatus_1,
        }),
    );
    const newState_2 = todoListsReducer(
        state,
        todoListsActions.changeTodoListsEntityStatus({
          todolistID: todolistID_2,
          entityStatus: entityStatus_2,
        }),
    );

    expect(state[0].entityStatus).toBe(entityStatus);
    expect(state[1].entityStatus).toBe(entityStatus);

    expect(newState_1[0].entityStatus).toBe(entityStatus_1);
    expect(newState_2[1].entityStatus).toBe(entityStatus_2);
  });
});