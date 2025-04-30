import { Badge } from '@/components/ui/badge';

export function TextQuestionSummary({ data, responseCount }) {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <p className="text-sm text-muted-foreground">Most Common Answer</p>
      {data.mostFrequent.value ? (
        <div className="mt-3">
          <div className="flex justify-between items-center">
            <div className="max-w-[80%]">
              <p className="text-md font-medium line-clamp-2">
                &quot;{data.mostFrequent.value}&quot;
              </p>
            </div>
            <Badge variant="secondary">
              {data.mostFrequent.count}{' '}
              {data.mostFrequent.count === 1 ? 'response' : 'responses'}
            </Badge>
          </div>
          <div className="mt-2">
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (data.mostFrequent.count / responseCount) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {Math.round((data.mostFrequent.count / responseCount) * 100)}% of
              responses
            </p>
          </div>
        </div>
      ) : (
        <p className="text-md mt-2">No common answer found</p>
      )}
    </div>
  );
}
