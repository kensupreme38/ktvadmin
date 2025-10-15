"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Lazy loaded components with loading fallbacks
 * This helps reduce initial bundle size and improves Time to Interactive
 */

// Loading fallbacks
const TableLoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const FormLoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-10 w-32" />
  </div>
);

const CardLoadingFallback = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-64 w-full" />
    ))}
  </div>
);

const GalleryLoadingFallback = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <Skeleton key={i} className="aspect-square w-full" />
    ))}
  </div>
);

// Lazy loaded admin components
export const LazyKtvForm = dynamic(
  () => import('@/components/admin/KtvForm').then((mod) => mod.KtvForm),
  {
    loading: FormLoadingFallback,
    ssr: false, // Disable SSR for form components
  }
);

export const LazyUserForm = dynamic(
  () => import('@/components/admin/UserForm').then((mod) => mod.UserForm),
  {
    loading: FormLoadingFallback,
    ssr: false,
  }
);

export const LazyCategoryForm = dynamic(
  () => import('@/components/admin/CategoryForm').then((mod) => mod.CategoryForm),
  {
    loading: FormLoadingFallback,
    ssr: false,
  }
);

export const LazyArticleForm = dynamic(
  () => import('@/components/admin/ArticleForm').then((mod) => mod.ArticleForm),
  {
    loading: FormLoadingFallback,
    ssr: false,
  }
);

export const LazyImageGallery = dynamic(
  () => import('@/components/admin/ImageGallery').then((mod) => mod.ImageGallery),
  {
    loading: GalleryLoadingFallback,
    ssr: false,
  }
);

// Lazy loaded UI components (heavy components)
export const LazyCalendar = dynamic(
  () => import('@/components/ui/calendar').then((mod) => ({ default: mod.Calendar })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
);

// Recharts components should be imported directly when needed
// export const LazyChart = dynamic(
//   () => import('recharts').then((mod) => mod),
//   {
//     loading: () => <Skeleton className="h-64 w-full" />,
//     ssr: false,
//   }
// );

// Create a higher-order component for lazy loading
export function withLazyLoad<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: JSX.Element
) {
  return dynamic(importFunc, {
    loading: () => fallback || <Skeleton className="h-64 w-full" />,
    ssr: false,
  });
}

// Export loading components for reuse
export const LoadingFallbacks = {
  Table: TableLoadingFallback,
  Form: FormLoadingFallback,
  Card: CardLoadingFallback,
  Gallery: GalleryLoadingFallback,
};

