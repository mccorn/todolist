import { configureStore } from '@reduxjs/toolkit'
import TodosReducer from './reducers/TodosSlice'

export const store = configureStore({
  reducer: {
    todos: TodosReducer
  },
})

export type RootState = ReturnType<typeof store.getState>