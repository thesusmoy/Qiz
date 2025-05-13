
'use client';

import { useMemo } from 'react';
import { A11y, Navigation, Pagination } from 'swiper/modules';


export function useCarouselConfig({
  items = [],
  maxSlots = 5,
  breakpoints = {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
}) {
  
  const emptySlots = useMemo(() => {
    return Math.max(0, maxSlots - items.length);
  }, [items.length, maxSlots]);

  
  const placeholders = useMemo(() => {
    return Array(emptySlots).fill(null);
  }, [emptySlots]);

  
  const carouselConfig = {
    modules: [Navigation, Pagination, A11y],
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: true,
    pagination: { clickable: true },
    breakpoints,
    className: 'w-full',
  };

  return {
    items,
    placeholders,
    carouselConfig,
    totalSlots: items.length + emptySlots,
  };
}
