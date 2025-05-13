'use client';

import { useState, useEffect } from 'react';

export function useFormState({ initialValues, currentValues, options = {} }) {
  const {
    compareNormalized = true,
    normalizeStrings = true,
    deepCompare = true,
  } = options;

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const normalizeString = (value) =>
      normalizeStrings && typeof value === 'string' ? value.trim() : value;

    const compareArrays = (arr1, arr2) => {
      if (!arr1 || !arr2) return arr1 === arr2;
      if (arr1.length !== arr2.length) return false;

      const sorted1 = [...arr1].sort();
      const sorted2 = [...arr2].sort();
      return JSON.stringify(sorted1) === JSON.stringify(sorted2);
    };

    const compareCommaSeparated = (val1, val2) => {
      const arr1 = val1
        ? val1
            .split(',')
            .map((e) => normalizeString(e))
            .filter(Boolean)
            .sort()
        : [];
      const arr2 = val2
        ? val2
            .split(',')
            .map((e) => normalizeString(e))
            .filter(Boolean)
            .sort()
        : [];
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    };

    const areEqual = (objA, objB, path = '') => {
      if (objA === objB) return true;
      if (!objA || !objB) return false;

      if (Array.isArray(objA)) {
        return compareArrays(objA, objB);
      }

      if (path.includes('allowedUsers') || path.includes('tags')) {
        return compareCommaSeparated(objA, objB);
      }

      if (typeof objA === 'object' && typeof objB === 'object') {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) return false;

        return keysA.every((key) => {
          const valA = objA[key];
          const valB = objB[key];

          if (typeof valA === 'object' && valA !== null) {
            return deepCompare
              ? areEqual(valA, valB, `${path}.${key}`)
              : valA === valB;
          }

          const normalizedA = normalizeString(valA);
          const normalizedB = normalizeString(valB);

          return normalizedA === normalizedB;
        });
      }

      return normalizeString(objA) === normalizeString(objB);
    };

    const formChanged = !areEqual(initialValues, currentValues);
    setHasChanges(formChanged);
  }, [
    initialValues,
    currentValues,
    compareNormalized,
    normalizeStrings,
    deepCompare,
  ]);

  const resetChanges = () => {
    setHasChanges(false);
  };

  return {
    hasChanges,
    resetChanges,
  };
}
