import { AppRootState } from 'app/store';
import { TodolistDomainType } from '../slices';
import { TaskDomainType } from 'api/task-api'

export const todoListsSelector = (state: AppRootState): TodolistDomainType[] => state.todolists;
export const todoListSelector = (state: AppRootState, id: number): TodolistDomainType => state.todolists[id];