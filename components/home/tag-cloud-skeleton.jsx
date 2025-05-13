
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

export function TagCloudSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array(12)
        .fill(null)
        .map((_, index) => (
          <SkeletonWrapper
            key={index}
            width={60 + Math.floor(Math.random() * 60)}
            height={32}
            className="rounded-full"
          />
        ))}
    </div>
  );
}
