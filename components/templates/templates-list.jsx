'use client';

import { useEffect, useState } from 'react';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatesListSkeleton } from '@/components/templates/templates-list-skeleton';
import { useSearchParams } from 'next/navigation';

export function TemplatesList({ initialTemplates, session }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const isAdmin = session?.user?.role === 'ADMIN';

  
  useEffect(() => {
    
    setLoading(true);

    
    const timer = setTimeout(() => {
      setTemplates(initialTemplates);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, initialTemplates]);

  if (loading) {
    return <TemplatesListSkeleton />;
  }

  
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No templates found
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isOwner={template.authorId === session?.user?.id}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
