import { Skeleton } from '@/components/ui/skeleton';
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

export default function AdminResponsesLoading() {
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

      {}
      <Heading
        title="Form Responses Management"
        description="View and manage all form responses in the system"
      />

      {}
      <div className="rounded-md border">
        {}
        <div className="border-b">
          <div className="flex h-14 items-center px-4">
            <div className="flex flex-1 items-center gap-4">
              <Skeleton className="h-4 w-[150px]" /> {}
              <Skeleton className="h-4 w-[150px]" /> {}
              <Skeleton className="h-4 w-[120px]" /> {}
              <Skeleton className="h-4 w-[120px]" /> {}
              <Skeleton className="h-4 w-[70px]" /> {}
            </div>
          </div>
        </div>

        {}
        <div>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="border-b px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    {}
                    <div className="w-[150px]">
                      <Skeleton className="h-4 w-[130px]" />
                    </div>

                    {}
                    <div className="w-[150px]">
                      <Skeleton className="h-4 w-[120px]" />
                    </div>

                    {}
                    <div className="w-[120px]">
                      <Skeleton className="h-4 w-[100px]" />
                    </div>

                    {}
                    <div className="w-[120px]">
                      <Skeleton className="h-4 w-[100px]" />
                    </div>

                    {}
                    <div className="flex items-center justify-end w-[70px]">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
