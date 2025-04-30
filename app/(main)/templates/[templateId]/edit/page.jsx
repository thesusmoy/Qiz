import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TemplateEditForm } from '@/components/templates/template-edit/template-edit-form';
import { getTemplateForEdit } from '@/lib/actions/template-actions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function EditTemplatePage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateForEdit(templateId);

  if (result.error || !result.data) {
    notFound();
  }

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
            <BreadcrumbLink href={`/templates/${templateId}`} asChild>
              <Link href={`/templates/${templateId}`}>{result.data.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Template</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground">
          Update your template details and questions
        </p>
      </div>
      <TemplateEditForm template={result.data} />
    </div>
  );
}
