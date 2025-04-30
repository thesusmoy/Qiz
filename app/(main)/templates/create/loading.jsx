import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function CreateTemplateLoading() {
  return (
    <div className="container max-w-3xl py-6 space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold">Create Template</h1>
        <p className="text-muted-foreground">
          Create a new template for your forms
        </p>
      </div>

      {}
      <div className="space-y-8">
        {}
        <div className="flex items-center gap-4">
          <Skeleton className="w-40 h-40 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[120px]" /> {}
            <Skeleton className="h-4 w-[140px]" /> {}
          </div>
        </div>

        {}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" /> {}
            <Skeleton className="h-10 w-full" /> {}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" /> {}
            <Skeleton className="h-32 w-full" /> {}
          </div>
        </div>

        {}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" /> {}
          <Skeleton className="h-10 w-full" /> {}
        </div>

        {}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" /> {}
          <Skeleton className="h-10 w-full" /> {}
        </div>

        {}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" /> {}
            <Skeleton className="h-10 w-[140px]" /> {}
          </div>

          {}
          {Array(2)
            .fill(null)
            .map((_, index) => (
              <Card key={index} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-20" /> {}
                      <Skeleton className="h-10 w-full" />{' '}
                      {}
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" /> {}
                      <Skeleton className="h-20 w-full" />{' '}
                      {}
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" /> {}
                      <Skeleton className="h-10 w-full" /> {}
                    </div>
                  </div>
                  <Skeleton className="h-10 w-10" /> {}
                </div>
              </Card>
            ))}
        </div>

        {}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[100px]" /> {}
          <Skeleton className="h-10 w-[100px]" /> {}
        </div>
      </div>
    </div>
  );
}
