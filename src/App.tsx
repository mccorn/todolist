import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { RootState } from './store';
import { setTodos } from './store/reducers/TodosSlice';
import CreateForm from './widgets/CreateForm/CreateForm';

import './App.css'
import TodosList from './widgets/TodosList/TodosList';

function App() {
  const [filter, setFilter] = useState(0);
  const { todos } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const handleChangeFilter = (value: number) => setFilter(value);
  
  const sortedTodos = useMemo(() => {
    const sortFunctions = [
      () => todos,
      () => todos.slice(0).sort((a, b) => +b.done - +a.done),
      () => todos.slice(0).sort((a, b) => +a.done - +b.done),
    ]

    return sortFunctions[filter]?.()
  }, [filter, todos])


  const reorder = (list: unknown[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    dispatch(setTodos(items))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='panel'>
        <CreateForm />
        <select value={filter} onChange={(e) => handleChangeFilter(+e.target.value)}>
          <option value={0}>Без сортировки</option>
          <option value={1}>Сначала выполненные</option>
          <option value={2}>Сначала невыполненные</option>
        </select>
      </div>

      <TodosList data={sortedTodos} />
    </DragDropContext>
  )
}

export default App
