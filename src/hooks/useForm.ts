import { useState, useCallback } from 'react';
import { FormState, ValidationError } from '../types';

export function useForm<T extends Record<string, any>>(
  initialData: T,
  validationSchema?: (data: T) => ValidationError[]
) {
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: [],
    isSubmitting: false,
    isValid: true,
  });

  const validate = useCallback((data: T): boolean => {
    if (!validationSchema) {
      setState(prev => ({ ...prev, errors: [], isValid: true }));
      return true;
    }

    const errors = validationSchema(data);
    setState(prev => ({ ...prev, errors, isValid: errors.length === 0 }));
    return errors.length === 0;
  }, [validationSchema]);

  const setField = useCallback((field: keyof T, value: any) => {
    setState(prev => {
      const newData = { ...prev.data, [field]: value };
      return {
        ...prev,
        data: newData,
        errors: prev.errors.filter(error => error.field !== field),
      };
    });
  }, []);

  const setFields = useCallback((fields: Partial<T>) => {
    setState(prev => {
      const newData = { ...prev.data, ...fields };
      return {
        ...prev,
        data: newData,
        errors: prev.errors.filter(error => !(error.field in fields)),
      };
    });
  }, []);

  const setError = useCallback((field: keyof T, message: string) => {
    setState(prev => ({
      ...prev,
      errors: [
        ...prev.errors.filter(error => error.field !== field),
        { field: field as string, message },
      ],
      isValid: false,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [], isValid: true }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      errors: [],
      isSubmitting: false,
      isValid: true,
    });
  }, [initialData]);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return state.errors.find(error => error.field === field)?.message;
  }, [state.errors]);

  const hasFieldError = useCallback((field: keyof T): boolean => {
    return state.errors.some(error => error.field === field);
  }, [state.errors]);

  return {
    ...state,
    setField,
    setFields,
    setError,
    clearErrors,
    reset,
    setSubmitting,
    validate,
    getFieldError,
    hasFieldError,
  };
}
