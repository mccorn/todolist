import classNames from 'classnames';
import { TodoData } from '../../types'
import './Todo.css'
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
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
  const ref = useRef({}) as MutableRefObject<HTMLDivElement>;
  const inputRef = useRef({}) as MutableRefObject<HTMLInputElement>;

  const handleChangeEditValue = (value: string) => setEditValue(value);

  const handleEndEdit = useCallback(() => {
    dispatch(patchTodo({ id: data.id, title: editValue }));
    setEditMode(false);
  }, [data, editValue, dispatch])

  const handleClickOutside = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    if (ref.current && !ref.current.contains(target)) {
      dispatch(patchTodo(data));
      setEditMode(false);
      setEditValue(data.title);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [ref, data, dispatch])

  const handleStartEdit = useCallback(() => {
    setEditMode(true);
    document.addEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside])

  useEffect(() => () => document.removeEventListener("mousedown", handleClickOutside), [])
  useEffect(() => {editMode ? inputRef.current.focus() : null}, [editMode])

  return (
    <div id={`todo-${data.id}`} ref={ref} className={classNames('todoCard flex', { done: data.done })}>
      <div className='todoCard__body column'>
        <div className='todoCard__header flex'>
          <input className='todoCard__checkbox'
            type='checkbox'
            checked={data.done}
            onChange={onDone}
          />
          <div>
            <input
              className={classNames('todoCard__input', {hidden: !editMode})}
              ref={inputRef}
              value={editValue}
              onChange={(e) => handleChangeEditValue(e.target.value)}
            />
            {!editMode && <p>{data.title}</p>}

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
