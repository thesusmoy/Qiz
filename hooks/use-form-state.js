// hooks/use-form-state.js
'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for managing complex form state and detecting changes
 * @param {Object} params - Configuration parameters
 * @param {Object} params.initialValues - Initial values to compare against
 * @param {Object} params.currentValues - Current form values
 * @param {Object} params.options - Additional options
 * @returns {Object} Form state utilities
 */
export function useFormState({ initialValues, currentValues, options = {} }) {
  const {
    compareNormalized = true,
    normalizeStrings = true,
    deepCompare = true,
  } = options;

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Helper function to normalize strings (trim whitespace)
    const normalizeString = (value) =>
      normalizeStrings && typeof value === 'string' ? value.trim() : value;

    // Helper for comparing arrays using JSON stringify
    const compareArrays = (arr1, arr2) => {
      if (!arr1 || !arr2) return arr1 === arr2;
      if (arr1.length !== arr2.length) return false;

      const sorted1 = [...arr1].sort();
      const sorted2 = [...arr2].sort();
      return JSON.stringify(sorted1) === JSON.stringify(sorted2);
    };

    // Handle special case for comma-separated values (like tags, emails)
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

    // Deep equality check for objects
    const areEqual = (objA, objB, path = '') => {
      // Handle null/undefined cases
      if (objA === objB) return true;
      if (!objA || !objB) return false;

      if (Array.isArray(objA)) {
        return compareArrays(objA, objB);
      }

      // Special handling for comma-separated strings
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

          // Normalize string values if requested
          const normalizedA = normalizeString(valA);
          const normalizedB = normalizeString(valB);

          return normalizedA === normalizedB;
        });
      }

      return normalizeString(objA) === normalizeString(objB);
    };

    // Perform comparison
    const formChanged = !areEqual(initialValues, currentValues);
    setHasChanges(formChanged);
  }, [
    initialValues,
    currentValues,
    compareNormalized,
    normalizeStrings,
    deepCompare,
  ]);

  // Reset function to clear changes state
  const resetChanges = () => {
    setHasChanges(false);
  };

  return {
    hasChanges,
    resetChanges,
  };
}
