import {useState} from 'react';

const UseForm = initVal => {
  const [form, setForm] = useState(initVal);
  return [
    form,
    (formType, formValue) => {
      if (formType === 'reset') {
        return setForm(initVal);
      }
      return setForm({...form, [formType]: formValue});
    },
  ];
};

export default UseForm;