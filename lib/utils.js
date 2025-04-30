import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getImageUrl(path) {
  return process.env.NEXT_PUBLIC_ASSET_PREFIX
    ? `${process.env.NEXT_PUBLIC_ASSET_PREFIX}${path}`
    : path;
}
