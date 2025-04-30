import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export function EmptyTemplateCard() {
  return (
    <Card className="h-[230px] border-dashed hover:shadow-md transition-shadow">
      <CardHeader className="pt-3.5">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <Link
            href="/templates/create"
            className="text-lg font-semibold hover:underline line-clamp-1"
          >
            Create New Template
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Get started with your own template
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          Create custom forms, surveys, and quizzes. Share them with others and
          collect responses.
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="secondary">Template</Badge>
          <Badge variant="outline">New</Badge>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link
          href="/templates/create"
          className="text-sm text-primary hover:underline"
        >
          Create template →
        </Link>
      </CardFooter>
    </Card>
  );
}
