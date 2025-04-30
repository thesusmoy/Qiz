'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TemplatePageClientFallback({ templateId }) {
  const router = useRouter();

  useEffect(() => {
    // Wait a moment for session to establish
    const timer = setTimeout(() => {
      // Refresh to same URL but without the special parameter
      router.refresh();
      router.push(`/templates/${templateId}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [templateId, router]);

  return <div>Loading template...</div>;
}
