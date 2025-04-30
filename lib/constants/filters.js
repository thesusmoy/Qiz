// lib/constants/filters.js
import { Clock, Globe, Lock, History, Users2, UserCircle2 } from 'lucide-react';

/**
 * Constants for template view filters
 */
export const VIEW_FILTERS = [
  { id: 'other', label: 'Other Templates', icon: Users2 },
  { id: 'my', label: 'My Templates', icon: UserCircle2 },
];

/**
 * Constants for template status filters
 */
export const STATUS_FILTERS = [
  { id: 'public', label: 'Public', icon: Globe },
  { id: 'private', label: 'Private', icon: Lock },
];

/**
 * Constants for template time/sort filters
 */
export const TIME_FILTERS = [
  { id: 'latest', label: 'Latest First', icon: Clock },
  { id: 'oldest', label: 'Oldest First', icon: History },
];

/**
 * Default sort option
 */
export const DEFAULT_SORT = 'latest';

/**
 * Get filter item by ID
 * @param {Array} filterArray - The filter array to search
 * @param {string} id - The filter ID to find
 * @returns {Object|undefined} The matching filter item or undefined
 */
export function getFilterById(filterArray, id) {
  return filterArray.find((item) => item.id === id);
}

/**
 * All available filter types
 */
export const FILTER_TYPES = {
  VIEW: 'filter',
  STATUS: 'status',
  SORT: 'sort',
  TOPIC: 'topic',
  TAG: 'tag',
};
