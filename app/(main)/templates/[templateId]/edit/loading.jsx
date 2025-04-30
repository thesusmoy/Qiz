import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function EditTemplateLoading() {
  return (
    <div className="container max-w-3xl py-6 space-y-6">
      {/* Keep the breadcrumb structure visible but with skeleton title */}
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
            <Skeleton className="h-4 w-40" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Template</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Keep the title and description visible as it's static */}
      <div>
        <h1 className="text-2xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground">
          Update your template details and questions
        </p>
      </div>

      {/* Form skeleton */}
      <div className="space-y-8">
        {/* Image upload section */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-40 h-40 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-4 w-[140px]" />
          </div>
        </div>

        {/* Template details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Questions section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Questions</h3>
            <Skeleton className="h-10 w-[140px]" />
          </div>

          {/* Question cards */}
          {Array(2)
            .fill(null)
            .map((_, index) => (
              <Card key={index} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-10" />
                </div>
              </Card>
            ))}
        </div>

        {/* Form buttons */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
