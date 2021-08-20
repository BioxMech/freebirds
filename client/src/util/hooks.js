import { useState } from 'react';

// Custom hooks - so you can use it for multiple files (login & register)
export const useForm = (callback, initialState = {}) => {

  const [values, setValues] = useState(initialState);


  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  }

  const onDone = (file) => {
    setValues({ ...values, profilePicture: file })
  }

  return {
    onChange,
    onSubmit,
    onDone,
    values
  }
}