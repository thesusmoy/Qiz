import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getResponseDetails } from '@/lib/actions/form-actions';
import { ResponseDetail } from '@/components/responses/response-detail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Calendar, User } from 'lucide-react'; // Remove ArrowLeft import
import { auth } from '@/auth';

export default async function ResponseDetailPage({ params }) {
  const { templateId, responseId } = await params;
  const result = await getResponseDetails(templateId, responseId);
  const session = await auth();

  if (result.error || !result.data) {
    notFound();
  }

  const { template, user, updatedAt } = result.data;

  const isAdmin = session?.user?.role === 'ADMIN';
  const isTemplateOwner = template.author?.id === session?.user?.id;
  const canAccessResponses = isAdmin || isTemplateOwner;

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
              <Link href={`/templates/${templateId}`}>{template.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {canAccessResponses && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/templates/${templateId}/responses`}
                  asChild
                >
                  <Link href={`/templates/${templateId}/responses`}>
                    Responses
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Response Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <Badge variant="secondary">Response</Badge>
          </div>
          <p className="text-muted-foreground">Form response details</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-muted/50 rounded-lg p-4 border">
        {template.author && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Template by{' '}
              <span className="font-medium">{template.author.name}</span>
            </span>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Submitted by <span className="font-medium">{user.name}</span>
            </span>
          </div>
        )}

        {updatedAt && (
          <div className="flex items-center gap-2 ml-auto">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {updatedAt !== result.data.createdAt
                ? `Updated ${formatDate(updatedAt)}`
                : `Submitted ${formatDate(result.data.createdAt)}`}
            </span>
          </div>
        )}
      </div>

      <ResponseDetail templateId={templateId} response={result.data} />
    </div>
  );
}
