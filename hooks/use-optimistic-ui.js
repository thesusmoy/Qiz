'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';

export function useOptimisticUI(initialValue, paramName, options = {}) {
  const {
    baseUrl = '/templates',
    preventToggle = false,
    debounceTime = 0,
  } = options;

  const { params, setParams } = useQueryParams({ baseUrl });
  const [isPending, startTransition] = useTransition();
  const [localValue, setLocalValue] = useState(
    initialValue || params[paramName] || ''
  );

  const [optimisticValue, setOptimisticValue] = useOptimistic(
    initialValue || params[paramName] || '',
    (state, newValue) => newValue
  );

  const handleChange = (newValue) => {
    const finalValue =
      !preventToggle && newValue === optimisticValue ? undefined : newValue;

    setLocalValue(finalValue || '');

    startTransition(() => {
      setOptimisticValue(finalValue || '');
      setParams({
        [paramName]: finalValue,
      });
    });

    return finalValue;
  };

  return {
    value: optimisticValue,
    localValue,
    setLocalValue,
    handleChange,
    isPending,
    startTransition,
    isActive: !!optimisticValue,
  };
}
