'use client';

import { useOptimisticUI } from '@/hooks/use-optimistic-ui';

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
