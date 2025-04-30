import { auth } from '@/auth';
import { getTemplates } from '@/lib/actions/template-actions';
import { TemplatesList } from '@/components/templates/templates-list';
import { TemplateFilters } from '@/components/templates/template-filters';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function TemplatesPage({ searchParams }) {
  const { query, topic, tag, filter, status, sort } =
    (await searchParams) || {};
  const sortDefault = sort || 'latest';

  const session = await auth();

  const { data: templates, error } = await getTemplates({
    query,
    topic,
    tag,
    filter,
    status,
    sort,
  });

  return (
    <div className="space-y-6">
      {}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Templates</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage your form templates</p>
        </div>
        <Link href="/templates/create">
          <Button>Create Template</Button>
        </Link>
      </div>

      {}
      <div className="grid grid-cols-[280px_1fr] gap-6">
        {}
        <div className="space-y-4">
          <TemplateFilters
            currentTopic={topic}
            currentTag={tag}
            currentFilter={filter}
            currentStatus={status}
            currentSort={sortDefault}
          />
        </div>

        {}
        <div>
          {error ? (
            <div className="text-center text-muted-foreground">{error}</div>
          ) : (
            <TemplatesList
              initialTemplates={templates || []}
              session={session}
            />
          )}
        </div>
      </div>
    </div>
  );
}
