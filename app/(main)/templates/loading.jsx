import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TemplateFilters } from '@/components/templates/template-filters';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function TemplatesLoading() {
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
            <BreadcrumbPage>Templates</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage your form templates</p>
        </div>
        <Link href="/templates/create">
          <Button>Create Template</Button>
        </Link>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <TemplateFilters />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="rounded-lg border h-[380px]">
                <div className="relative w-full h-[180px]">
                  <Skeleton className="h-full w-full rounded-t-lg" />
                </div>

                <div className="h-[9.5rem]">
                  <div className="px-3 py-2 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-3 w-[70px]" />
                    </div>

                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </div>

                  <div className="px-3 py-1">
                    <div className="flex justify-between items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-[90px]" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-between px-2 py-1 border-t">
                  <div className="flex-1 overflow-x-hidden">
                    <div className="flex gap-0.5">
                      <Skeleton className="h-5 w-16 flex-shrink-0" />
                      <Skeleton className="h-5 w-16 flex-shrink-0" />
                      <Skeleton className="h-5 w-16 flex-shrink-0" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 flex-shrink-0" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
