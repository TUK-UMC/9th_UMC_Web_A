import { useState } from 'react';

interface Validation {
  [key: string]: (value: string) => string | null;
}

export const useForm = (initialValues: { [key: string]: string }, validations: Validation) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (validations[name]) {
      const error = validations[name](value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const isFormValid = () => {
    const newErrors: { [key: string]: string | null } = {};
    let isValid = true;

    for (const key in validations) {
      const error = validations[key](values[key]);
      if (error) {
        isValid = false;
      }
      newErrors[key] = error;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isButtonDisabled = () => {
    return Object.values(errors).some(error => error !== null) || Object.values(values).some(value => value === '');
  }

  return { values, errors, handleChange, isFormValid, isButtonDisabled };
};
