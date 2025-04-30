
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export function TopTemplatesTable({ templates }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Template</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Responses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell>
              <Link
                href={`/templates/${template.id}`}
                className="hover:underline"
              >
                {template.title}
              </Link>
            </TableCell>
            <TableCell>{template.author.name}</TableCell>
            <TableCell>{template.responseCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
