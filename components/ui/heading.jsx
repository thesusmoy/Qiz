
export function Heading({ title, description }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
