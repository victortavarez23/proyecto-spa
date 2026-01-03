import { useState, useCallback } from 'react';

const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en los campos
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue
    }));

    // Validación en tiempo real (si el campo ya fue tocado)
    if (touched[name] && validate) {
      const newErrors = validate({ ...values, [name]: newValue });
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: newErrors[name] || ''
      }));
    }
  }, [touched, validate, values]);

  // Manejar blur (cuando el usuario deja el campo)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validar al salir del campo
    if (validate) {
      const newErrors = validate(values);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: newErrors[name] || ''
      }));
    }
  }, [validate, values]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Establecer valores manualmente
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  // Retornamos todo lo necesario
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setErrors,
    setTouched,
    setIsSubmitting,
    resetForm
  };
};

export default useForm;