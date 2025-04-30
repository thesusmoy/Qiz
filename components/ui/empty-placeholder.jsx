export function EmptyPlaceholder({ title, description, children }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h2 className="mt-6 text-xl font-semibold">{title}</h2>
        {description && (
          <p className="mt-2 mb-4 text-center text-sm font-normal leading-6 text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
