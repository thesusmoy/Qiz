'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string'; // Popular query string management library

export function useQueryParams(options = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { baseUrl = '' } = options;

  const getParams = useCallback(() => {
    if (!searchParams) return {};
    return qs.parse(searchParams.toString());
  }, [searchParams]);

  const setParams = useCallback(
    (updates, { replace = false } = {}) => {
      if (!router) return {};

      const current = getParams();
      const updated = { ...current };

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          delete updated[key];
        } else {
          updated[key] = value;
        }
      });

      const path =
        typeof window !== 'undefined' ? window.location.pathname : '';
      const url = qs.stringifyUrl(
        {
          url: baseUrl || path,
          query: updated,
        },
        { skipNull: true, skipEmptyString: true }
      );

      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }

      return updated;
    },
    [router, getParams, baseUrl]
  );

  const toggleParam = useCallback(
    (key, value) => {
      const current = getParams();
      const currentValue = current[key];

      if (currentValue === value) {
        return setParams({ [key]: undefined });
      }

      return setParams({ [key]: value });
    },
    [getParams, setParams]
  );

  const currentParams = getParams();

  return {
    params: currentParams,
    getParams,
    setParams,
    toggleParam,
    searchParams,
  };
}
