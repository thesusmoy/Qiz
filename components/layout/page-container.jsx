'use client';

import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function PageContainer({
  children,
  breadcrumbItems,
  className,
  maxWidth = '8xl',
  spacing = '8',
  centered = false,
  hideBreadcrumb = false,
  title,
  description,
  actions,
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');

  const shouldShowBreadcrumb =
    !hideBreadcrumb && !isHomePage && breadcrumbItems?.length > 0;

  const showHeader = title || description || actions;

  return (
    <div
      className={cn(
        isAdminPage
          ? 'w-full py-2 space-y-6 px-1'
          : `container max-w-${maxWidth} py-2 xl:px-0 space-y-${spacing}`,
        centered && 'flex flex-col items-center',
        className
      )}
    >
      {shouldShowBreadcrumb && <PageBreadcrumb items={breadcrumbItems} />}

      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
