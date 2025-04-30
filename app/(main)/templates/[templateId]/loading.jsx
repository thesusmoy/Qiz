// app/(main)/templates/[templateId]/loading.jsx
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function TemplateLoading() {
  return (
    <div className="container max-w-3xl py-6 space-y-6">
      {/* Keep breadcrumb visible as it's static except for the template title */}
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
            <BreadcrumbPage>
              <Skeleton className="h-4 w-[150px] inline-block" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Template header */}
      <div>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        {/* Tab navigation */}
        <div className="border-b">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Tab content area */}
        <div className="space-y-6">
          {/* Overview tab content */}
          <div className="space-y-6">
            {/* Template info card */}
            <div className="rounded-md border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>

            {/* Questions section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Questions</h3>
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
