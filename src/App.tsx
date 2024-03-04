import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Todo from './components/Todo/Todo'
import { RootState } from './store';
import { patchTodo, removeTodoById } from './store/reducers/TodosSlice';
import CreateForm from './widgets/CreateForm/CreateForm';

function App() {
  // const { editMode, setEditMode } = useState(false);
  const { todos } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const handleDelete = (id: string | number) => dispatch(removeTodoById(id));
  const handleChangeDone = (id: string | number, done: boolean) => dispatch(patchTodo({id, done}));

  return (
    <>
      <CreateForm />
      {todos?.length
        ? todos.map(todo => <Todo
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
