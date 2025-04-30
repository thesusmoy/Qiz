// hooks/use-optimistic-ui.jsx
'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';

/**
 * Hook for managing UI state with optimistic updates tied to URL parameters
 * @param {string} initialValue - Initial value
 * @param {string} paramName - URL parameter name
 * @param {Object} options - Additional options
 * @returns {Object} State and handlers for optimistic UI updates
 */
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
    // For toggle behavior (clear if same value is selected)
    const finalValue =
      !preventToggle && newValue === optimisticValue ? undefined : newValue;

    // Update local state immediately for optimistic UI
    setLocalValue(finalValue || '');

    // Update URL with transition
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
