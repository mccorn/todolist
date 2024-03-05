import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd"
import { CSSProperties } from "react";
import { TodoData } from "../../types";
import Todo from "../../components/Todo/Todo";
import { patchTodo, removeTodoById } from "../../store/reducers/TodosSlice";
import { useDispatch } from "react-redux";
import { StrictModeDroppable } from "../../features/StrictModeDroppable";
import classNames from "classnames";

type TodosListProps = {
  data: TodoData[],
  filter: number
}

function TodosList({ data, filter }: TodosListProps) {
  const dispatch = useDispatch();

  const handleDelete = (id: string | number) => dispatch(removeTodoById(id));
  const handleChangeDone = (id: string | number, done: boolean) => dispatch(patchTodo({ id, done }));

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
    <StrictModeDroppable droppableId="droppable">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {data?.length
            ? data.map((todo, index) => <Draggable key={String(todo.id)} draggableId={String(todo.id)} index={index}>
              {(provided, snapshot) => <div
                className={classNames({ hidden: (filter === 3 && !todo.done) || (filter === 4 && todo.done) })}
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
  )
}

export default TodosList
