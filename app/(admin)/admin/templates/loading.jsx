import { Skeleton } from '@/components/ui/skeleton';
import { Heading } from '@/components/ui/heading';

export default function AdminTemplatesLoading() {
  return (
    <div className="space-y-6">
      {}
      <Heading
        title="Templates Management"
        description="View and manage all templates in the system"
      />

      {}
      <div className="rounded-md border">
        {}
        <div className="border-b">
          <div className="flex h-14 items-center px-4">
            <div className="flex flex-1 items-center gap-4">
              <Skeleton className="h-4 w-[100px]" /> {}
              <Skeleton className="h-4 w-[100px]" /> {}
              <Skeleton className="h-4 w-[100px]" /> {}
              <Skeleton className="h-4 w-[100px]" /> {}
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
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded" /> {}
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[200px]" /> {}
                        <Skeleton className="h-3 w-[150px]" />{' '}
                        {}
                      </div>
                    </div>

                    {}
                    <div className="w-[150px]">
                      <Skeleton className="h-4 w-[120px]" />
                    </div>

                    {}
                    <div className="w-[100px]">
                      <Skeleton className="h-6 w-16" />
                    </div>

                    {}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
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
