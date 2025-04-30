export function NumberQuestionSummary({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">Total Responses</p>
        <p className="text-2xl font-bold mt-1">{data.count || 0}</p>
      </div>
      <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">Average</p>
        <p className="text-2xl font-bold mt-1">
          {data.count ? data.average.toFixed(2) : 'N/A'}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">Sum</p>
        <p className="text-2xl font-bold mt-1">{data.sum || 0}</p>
      </div>
    </div>
  );
}
