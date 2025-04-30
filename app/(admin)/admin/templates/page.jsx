import { getAdminTemplates } from '@/lib/actions/admin-actions';
import { AdminDataTable } from '@/components/admin/data-table/admin-data-table';
import { adminTemplatesColumns } from '@/components/admin/templates/admin-templates-columns';
import { Heading } from '@/components/ui/heading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function AdminTemplatesPage() {
  const result = await getAdminTemplates();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">Error: {result.error}</div>
      </div>
    );
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
            <BreadcrumbPage>Templates</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Heading
        title="Templates Management"
        description="View and manage all templates in the system"
      />
      <AdminDataTable
        columns={adminTemplatesColumns}
        data={result.data || []}
      />
    </div>
  );
}
