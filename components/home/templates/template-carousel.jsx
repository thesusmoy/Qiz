'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { EmptyTemplateCard } from '../../templates/common/empty-template-card';
import { useCarouselConfig } from '@/hooks/use-carousel-config';

export function TemplateCarousel({ templates, count = 5 }) {
  const { placeholders, carouselConfig } = useCarouselConfig({
    items: templates,
    maxSlots: count,
  });

  return (
    <Swiper {...carouselConfig}>
      {templates.map((template) => (
        <SwiperSlide key={template.id}>
          <Card className="h-full">
            <CardHeader>
              <Link
                href={`/templates/${template.id}`}
                className="text-lg font-semibold hover:underline line-clamp-1"
              >
                {template.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                by {template.author.name}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-1 overflow-hidden">
                {template.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">{template.topic}</Badge>
                {template.isPublic && <Badge>Public</Badge>}
                {template._count?.responses > 0 && (
                  <Badge variant="outline">
                    {template._count.responses} responses
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/templates/${template.id}?initialLoad=true`}
                className="text-sm text-primary hover:underline"
              >
                View template →
              </Link>
            </CardFooter>
          </Card>
        </SwiperSlide>
      ))}

      {placeholders.map((_, index) => (
        <SwiperSlide key={`empty-${index}`}>
          <EmptyTemplateCard />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
