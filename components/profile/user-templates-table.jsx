'use client';

import { useEffect, useState } from 'react';
import { getUserTemplates } from '@/lib/actions/template-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Edit,
  Eye,
  Plus,
  Trash,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTemplateActions } from '@/hooks/use-template-actions';
import { DeleteTemplateDialog } from '@/components/templates/common/delete-template-dialog';

export function UserTemplatesTable() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const { toast } = useToast();
  const [sorting, setSorting] = useState({
    column: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    async function loadTemplates() {
      setIsLoading(true);
      try {
        const result = await getUserTemplates();
        if (result.data) {
          setTemplates(result.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || 'Failed to load templates',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load templates',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplates();
  }, [toast]);

  const handleDeleteSuccess = (deletedId) => {
    setTemplates(templates.filter((template) => template.id !== deletedId));
    toast({
      title: 'Template deleted',
      description: 'The template has been successfully deleted',
    });
  };

  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    const { column, direction } = sorting;

    if (column === 'title') {
      return direction === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    if (column === 'status') {
      const statusA = a.isPublic ? 'Public' : 'Private';
      const statusB = b.isPublic ? 'Public' : 'Private';
      return direction === 'asc'
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    }

    if (column === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (column === 'responses') {
      const countA = a._count?.responses || 0;
      const countB = b._count?.responses || 0;
      return direction === 'asc' ? countA - countB : countB - countA;
    }

    return 0;
  });

  const getSortIcon = (column) => {
    if (sorting.column !== column)
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sorting.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Templates</CardTitle>
        <Button asChild size="sm">
          <Link href="/templates/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[90px]" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[40px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You havent created any templates yet
            </p>
            <Button asChild variant="outline">
              <Link href="/templates/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('responses')}
                  >
                    <div className="flex items-center">
                      Responses
                      {getSortIcon('responses')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTemplates.map((template) => {
                  return (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={template.isPublic ? 'default' : 'outline'}
                        >
                          {template.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(template.createdAt)}</TableCell>
                      <TableCell>{template._count?.responses || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/templates/${template.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/templates/${template.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTemplateToDelete(template)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <DeleteTemplateDialog
          isOpen={!!templateToDelete}
          template={templateToDelete}
          onClose={() => setTemplateToDelete(null)}
          onSuccess={handleDeleteSuccess}
        />
      </CardContent>
    </Card>
  );
}
