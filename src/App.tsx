import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react';

import Todo from './components/Todo/Todo'
import { RootState } from './store';
import { patchTodo, removeTodoById } from './store/reducers/TodosSlice';
import CreateForm from './widgets/CreateForm/CreateForm';

import './App.css'

function App() {
  const [filter, setFilter] = useState(0);
  const { todos } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const handleChangeFilter = (value: number) => setFilter(value);
  const handleDelete = (id: string | number) => dispatch(removeTodoById(id));
  const handleChangeDone = (id: string | number, done: boolean) => dispatch(patchTodo({ id, done }));

  const sortedTodos = useMemo(() => {
    const sortFunctions = [
      () => todos,
      () => todos.slice(0).sort((a, b) => +b.done - +a.done),
      () => todos.slice(0).sort((a, b) => +a.done - +b.done),
    ]

    return sortFunctions[filter]?.()
  }, [filter, todos])

  return (
    <>
      <div className='panel'>
        <CreateForm />
        <select value={filter} onChange={(e) => handleChangeFilter(+e.target.value)}>
          <option value={0}>Без сортировки</option>
          <option value={1}>Сначала выполненные</option>
          <option value={2}>Сначала невыполненные</option>
        </select>
      </div>
      {sortedTodos?.length
        ? sortedTodos.map(todo => <Todo
          key={todo.id}
          data={todo}
          onDelete={() => handleDelete(todo.id)}
          onDone={() => handleChangeDone(todo.id, !todo.done)}
        />)
        : 'empty list'
      }
    </>
  )
}

export default App
