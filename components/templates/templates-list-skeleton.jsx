
import { Skeleton } from '@/components/ui/skeleton';

export function TemplatesListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="rounded-lg border h-[380px]">
            {}
            <div className="relative w-full h-[180px]">
              <Skeleton className="h-full w-full rounded-t-lg" />
            </div>

            {}
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>

              {}
              <div className="flex items-center justify-between mt-auto pt-4">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
