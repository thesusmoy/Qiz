
'use client';

import { Separator } from '@/components/ui/separator';

export function HomeSection({ title, children, showSeparator = true }) {
  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
      </section>

      {showSeparator && <Separator />}
    </>
  );
}
