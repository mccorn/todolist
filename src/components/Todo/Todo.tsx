import classNames from 'classnames';
import { TodoData } from '../../types'
import './Todo.css'

type TodoProps = {
  data: TodoData,
  onDone?: () => void,
  onDelete: () => void,
}

function Todo({ data, onDelete, onDone }: TodoProps) {
  return (
    <div className={classNames('todoCard flex', {done: data.done})}>
      <div className='todoCard__body column'>
        <div className='todoCard__header flex'>
          <input className='todoCard__checkbox'
            type='checkbox'
            checked={data.done}
            onChange={onDone}
          />
          <div>{data.id}</div>
          <p>{data.title}</p>
        </div>
      </div>
      <div className='todoCard__aside column'>
        <button>edit</button>
        <button onClick={onDelete}>delete</button>
      </div>
    </div>
  )
}

export default Todo
