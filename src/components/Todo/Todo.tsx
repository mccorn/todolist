import classNames from 'classnames';
import { TodoData } from '../../types'
import './Todo.css'
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchTodo } from '../../store/reducers/TodosSlice';

type TodoProps = {
  data: TodoData,
  onDone?: () => void,
  onDelete: () => void,
}

function Todo({ data, onDelete, onDone }: TodoProps) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(data.title);
  const dispatch = useDispatch();

  const handleChangeEditValue =(value: string) => {
    setEditValue(value)
  }

  const handleStartEdit = useCallback(() => {
    setEditMode(true)
  }, [])

  const handleEndEdit = useCallback(() => {
    dispatch(patchTodo({id: data.id, title: editValue}))
    setEditMode(false)
  }, [data, editValue, dispatch])

  return (
    <div id={`todo-${data.id}`} className={classNames('todoCard flex', { done: data.done })}>
      <div className='todoCard__body column'>
        <div className='todoCard__header flex'>
          <input className='todoCard__checkbox'
            type='checkbox'
            checked={data.done}
            onChange={onDone}
          />
          <div>
            {editMode
              ? <input value={editValue} onChange={(e) => handleChangeEditValue(e.target.value)}/>
              : <p>{data.title}</p>
            }

          </div>
        </div>
      </div>
      <div className='todoCard__aside column'>
        {editMode
          ? <button onClick={handleEndEdit}>save</button>
          : <button onClick={handleStartEdit}>edit</button>
        }

        <button onClick={onDelete}>delete</button>
      </div>
    </div>
  )
}

export default Todo
