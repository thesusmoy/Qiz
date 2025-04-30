import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminResponses } from '@/lib/actions/admin-actions';
import { AdminResponsesTable } from '@/components/admin/responses/admin-responses-table';
import { Heading } from '@/components/ui/heading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function AdminResponsesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { data, error } = await getAdminResponses();

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" asChild>
              <Link href="/admin">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Responses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Heading
        title="Form Responses Management"
        description="View and manage all form responses in the system"
      />

      <AdminResponsesTable initialResponses={data} />
    </div>
  );
}
