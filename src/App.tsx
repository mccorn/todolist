import { useDispatch, useSelector } from 'react-redux'
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, DraggingStyle, DropResult, Droppable, DroppableProps, NotDraggingStyle } from "react-beautiful-dnd";

import Todo from './components/Todo/Todo'
import { RootState } from './store';
import { patchTodo, removeTodoById, setTodos } from './store/reducers/TodosSlice';
import CreateForm from './widgets/CreateForm/CreateForm';

import './App.css'

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

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


  const reorder = (list: unknown[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const onDragEnd = (result: DropResult) => {

    if (!result.destination) {
      return;
    }

    const items = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    dispatch(setTodos(items))
  }

  const getItemStyle = (isDragging: unknown, draggableStyle?: DraggingStyle | NotDraggingStyle): CSSProperties => ({
    userSelect: "none",
    margin: isDragging ? "" : "0 0 10px 0",
    padding: 0,
    opacity: isDragging ? "0.8" : "1",
    position: isDragging ? "absolute" : "relative",
    zIndex: isDragging ? 1000 : "inherit",
    ...draggableStyle
  });

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

      <StrictModeDroppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sortedTodos?.length
              ? sortedTodos.map((todo, index) => <Draggable key={String(todo.id)} draggableId={String(todo.id)} index={index}>
                {(provided, snapshot) => <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                  <Todo
                    key={todo.id}
                    data={todo}
                    onDelete={() => handleDelete(todo.id)}
                    onDone={() => handleChangeDone(todo.id, !todo.done)}
                  />
                </div>}
              </Draggable>)
              : 'empty list'
            }
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}

export default App
