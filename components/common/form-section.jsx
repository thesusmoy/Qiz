'use client';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
