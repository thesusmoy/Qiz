'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export function MarkdownEditor({ value, onChange, label, error, className }) {
  const [mounted, setMounted] = useState(false);

  
  if (!mounted) {
    setMounted(true);
    return null;
  }

  return (
    <div className={cn('space-y-2', className)} data-color-mode="light">
      {label && <Label>{label}</Label>}
      <div className="border rounded-md">
        <MDEditor
          value={value}
          onChange={onChange}
          preview="edit"
          hideToolbar={false}
          height={200}
          className={cn('w-full', error && 'border-destructive')}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
