import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../../store/reducers/TodosSlice";

const CreateForm = () => {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const handleClick = () => {
    if (value.trim()) {
      dispatch(addTodo(value));
      setValue('');
    }
  }

  return (
    <div className='form'>
      <input value={value} onChange={(e) => setValue(e.target.value)}></input>
      <button onClick={handleClick}>add</button>
    </div>
  )
}

export default CreateForm;