
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';


export function TemplateCarouselSkeleton({ count = 5 }) {
  
  const carouselConfig = {
    modules: [Navigation, Pagination, A11y],
    spaceBetween: 16,
    slidesPerView: 'auto',
    navigation: true,
    pagination: { clickable: true },
    a11y: { enabled: true },
  };

  return (
    <Swiper {...carouselConfig}>
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <SwiperSlide
            key={index}
            style={{ width: '280px', maxWidth: '280px' }}
          >
            <Card className="h-full">
              <CardHeader>
                <SkeletonWrapper
                  variant="title"
                  height={24}
                  className="w-full"
                />
                <SkeletonWrapper width={120} height={16} />
              </CardHeader>
              <CardContent>
                <SkeletonWrapper variant="text" className="mb-4" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <SkeletonWrapper
                    width={80}
                    height={24}
                    className="rounded-full"
                  />
                  <SkeletonWrapper
                    width={60}
                    height={24}
                    className="rounded-full"
                  />
                  <SkeletonWrapper
                    width={110}
                    height={24}
                    className="rounded-full"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <SkeletonWrapper width={100} height={16} />
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
