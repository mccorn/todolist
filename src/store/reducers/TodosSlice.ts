import { createSlice } from '@reduxjs/toolkit'
import { TodoData } from '../../types'

export type TodosState = {
  todos: TodoData[]
}

const initialState: TodosState = {
  todos: JSON.parse(localStorage.getItem('todos') || '') || [],
}

export const TodosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload
      localStorage.setItem('todos', JSON.stringify(state.todos))
    },
    removeTodoById: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(state.todos))
    },
    addTodo: (state, action) => {
      state.todos.push({
        id: Date.now().toString(36),
        title: action.payload,
        done: false,
      })

      localStorage.setItem('todos', JSON.stringify(state.todos))
    },
    patchTodo: (state, action) => {
      const todo = state.todos.find(data => data.id === action.payload.id)
      if (todo) {
        Object.assign(todo, action.payload)
        localStorage.setItem('todos', JSON.stringify(state.todos))
      }
    }
  }
})

export const { removeTodoById, addTodo, patchTodo, setTodos } = TodosSlice.actions

export default TodosSlice.reducer