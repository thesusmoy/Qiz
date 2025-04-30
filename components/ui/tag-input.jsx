'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function TagInput({ value, onChange, disabled }) {
  const tags = value ? value.split(',').filter(Boolean) : [];

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const inputValue = e.target.value.trim();

      if (inputValue && !tags.includes(inputValue) && tags.length < 5) {
        const newTags = [...tags, inputValue];
        onChange(newTags.join(','));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    if (disabled) return;
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags.join(','));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1">
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {tags.length < 5 && (
        <Input
          type="text"
          placeholder="Type and press Enter to add tags"
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
    </div>
  );
}
