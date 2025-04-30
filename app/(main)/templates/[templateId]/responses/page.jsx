import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTemplateWithResponses } from '@/lib/actions/form-actions';
import { ResponsesList } from '@/components/responses/responses-list';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function ResponsesPage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateWithResponses(templateId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6">
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
            <BreadcrumbLink href={`/templates/${templateId}`} asChild>
              <Link href={`/templates/${templateId}`}>{result.data.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Responses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {result.data.title} - Responses
          </h1>
          <p className="text-muted-foreground">
            View and manage form responses
          </p>
        </div>
      </div>
      <ResponsesList
        templateId={templateId}
        initialResponses={result.data.responses}
        questions={result.data.questions}
      />
    </div>
  );
}
