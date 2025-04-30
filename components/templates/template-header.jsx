import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function TemplateHeader({ template }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{template.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Created by {template.author.name}</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(template.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{template.topic}</Badge>
        {template.isPublic && <Badge>Public</Badge>}
        {template.tags?.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
