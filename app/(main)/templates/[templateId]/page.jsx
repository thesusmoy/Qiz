import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getTemplateById } from '@/lib/actions/template-actions';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { TemplateTabs } from '@/components/templates/template-detail/template-tabs/template-tabs';
import { TemplatePageClientFallback } from '@/components/templates/template-detail/loading/template-page-client-fallback';

export default async function TemplatePage({ params, searchParams }) {
  const { templateId } = await params;
  const session = await auth();
  // If no session but has a special parameter, show a loading state instead of 404
  // This gives the session time to initialize
  if (!session?.user && searchParams.initialLoad === 'true') {
    // Return a client component that can handle redirecting or showing loading state
    return <TemplatePageClientFallback templateId={templateId} />;
  }
  const { data: template, error } = await getTemplateById(templateId);

  if (error || !template) {
    notFound();
  }

  const userResponse = template.responses?.[0];

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/templates" asChild>
              <Link href="/templates">Templates</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{template.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">{template.title}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <TemplateTabs
        template={template}
        session={session}
        userResponse={userResponse}
        templateId={templateId}
      />
    </div>
  );
}
