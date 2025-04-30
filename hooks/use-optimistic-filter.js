// hooks/use-optimistic-filter.jsx
'use client';

import { useOptimisticUI } from '@/hooks/use-optimistic-ui';

/**
 * Specialized hook for filter UI with optimistic updates
 * @param {string} initialValue - Initial filter value
 * @param {string} paramName - URL parameter name for this filter
 * @param {Object} options - Additional options
 * @returns {Object} Filter state and handlers
 */
export function useOptimisticFilter(initialValue, paramName, options = {}) {
  const filter = useOptimisticUI(initialValue, paramName, options);

  return {
    value: filter.value,
    handleChange: filter.handleChange,
    isActive: filter.isActive,
    isPending: filter.isPending,
    reset: () => filter.handleChange(undefined),
  };
}
