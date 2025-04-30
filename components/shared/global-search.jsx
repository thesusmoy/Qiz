// components/shared/global-search.jsx
'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon, Loader2 } from 'lucide-react';
import { useOptimisticUI } from '@/hooks/use-optimistic-ui';

export function GlobalSearch() {
  const searchParam = useOptimisticUI('', 'query', {
    baseUrl: '/templates',
    debounceTime: 300,
  });

  const debouncedSearch = useDebounce(searchParam.handleChange, 300);

  const handleChange = (e) => {
    const newValue = e.target.value;
    searchParam.setLocalValue(newValue); // Update local value immediately
    debouncedSearch(newValue); // Debounced URL update
  };

  return (
    <div className="relative flex-1 min-w-0">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search templates..."
        className="pl-8 w-full"
        value={searchParam.localValue}
        onChange={handleChange}
      />
      {searchParam.isPending && (
        <Loader2 className="absolute right-8 top-2.5 h-4 w-4 animate-spin" />
      )}
    </div>
  );
}
