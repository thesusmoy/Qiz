'use client';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * FormSection - A component for grouping related form fields with a title and description
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {ReactNode} props.children - Section content/fields
 * @param {boolean} props.withSeparator - Whether to show a separator above this section
 * @param {string} props.className - Additional classes
 * @param {string} props.contentClassName - Additional classes for the content area
 */
export function FormSection({
  title,
  description,
  children,
  withSeparator = false,
  className,
  contentClassName,
  ...props
}) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {withSeparator && <Separator className="my-6" />}

      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className={cn('space-y-6', contentClassName)}>{children}</div>
    </div>
  );
}
