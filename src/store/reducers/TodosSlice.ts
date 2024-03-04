import { createSlice } from '@reduxjs/toolkit'
import { TodoData } from '../../types'

const data = [
  {
    id: 1,
    title: "clone repo",
    done: false,
  },
  {
    id: 2,
    title: "create app 2",
    done: true,
  },
  {
    id: 3,
    title: "commit",
    done: false,
  }
]

type ProductsState = {
  todos: TodoData[]
}

const initialState: ProductsState = {
  todos: data,
  // todos: [],
}

export const ProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = [...action.payload]
    },
    removeTodoById: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    addTodo: (state, action) => {
      state.todos.push({
        id: state.todos.length + 1,
        title: action.payload,
        done: false,
      })
    },
    patchTodo: (state, action) => {
      const todo = state.todos.find(data => data.id === action.payload.id)
      if (todo) Object.assign(todo, action.payload)
    }
  }
})

export const { setTodos, removeTodoById, addTodo, patchTodo } = ProductsSlice.actions

export default ProductsSlice.reducer