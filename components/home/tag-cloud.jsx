'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export function TagCloud({ tags }) {
  const router = useRouter();

  if (!tags?.length) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">
          No tags yet. Tags will appear here when templates are created with
          tags.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
          style={{
            fontSize: `${Math.max(0.8, Math.min(2, tag.count / 10))}rem`,
          }}
          onClick={() =>
            router.push(`/templates?tag=${encodeURIComponent(tag.name)}`)
          }
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
