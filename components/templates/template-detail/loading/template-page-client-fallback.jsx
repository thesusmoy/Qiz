'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TemplatePageClientFallback({ templateId }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh();
      router.push(`/templates/${templateId}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [templateId, router]);

  return <div>Loading template...</div>;
}
