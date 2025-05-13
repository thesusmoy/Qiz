import { Clock, Globe, Lock, History, Users2, UserCircle2 } from 'lucide-react';

export const VIEW_FILTERS = [
  { id: 'other', label: 'Other Templates', icon: Users2 },
  { id: 'my', label: 'My Templates', icon: UserCircle2 },
];

export const STATUS_FILTERS = [
  { id: 'public', label: 'Public', icon: Globe },
  { id: 'private', label: 'Private', icon: Lock },
];

export const TIME_FILTERS = [
  { id: 'latest', label: 'Latest First', icon: Clock },
  { id: 'oldest', label: 'Oldest First', icon: History },
];

export const DEFAULT_SORT = 'latest';

export function getFilterById(filterArray, id) {
  return filterArray.find((item) => item.id === id);
}

export const FILTER_TYPES = {
  VIEW: 'filter',
  STATUS: 'status',
  SORT: 'sort',
  TOPIC: 'topic',
  TAG: 'tag',
};
