/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit frequency of function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Preload images for better UX
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = url;
        })
    )
  );
}

/**
 * Get optimal image size based on viewport
 */
export function getOptimalImageSize(width: number): number {
  const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  return sizes.find((size) => size >= width) || sizes[sizes.length - 1];
}

/**
 * Measure component render time (development only)
 */
export function measurePerformance(
  componentName: string,
  callback: () => void
): void {
  if (process.env.NODE_ENV === "development") {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`[Performance] ${componentName}: ${(end - start).toFixed(2)}ms`);
  } else {
    callback();
  }
}

/**
 * Batch multiple state updates
 */
export function batchUpdates<T>(
  updates: Array<() => void>
): void {
  // React 18 automatically batches updates
  updates.forEach((update) => update());
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get connection speed
 */
export function getConnectionSpeed(): string {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return "unknown";
  }
  
  const connection = (navigator as any).connection;
  return connection?.effectiveType || "unknown";
}

/**
 * Check if device has low-end hardware
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  
  // Consider low-end if less than 4 cores or less than 4GB RAM
  return hardwareConcurrency < 4 || memory < 4;
}

/**
 * Prefetch data
 */
export async function prefetchData<T>(
  fetcher: () => Promise<T>
): Promise<T | null> {
  try {
    const data = await fetcher();
    return data;
  } catch (error) {
    console.warn("Prefetch failed:", error);
    return null;
  }
}

/**
 * Create a request queue for rate limiting
 */
export class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.run();
    });
  }

  private async run() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const request = this.queue.shift();

    if (request) {
      try {
        await request();
      } finally {
        this.running--;
        this.run();
      }
    }
  }
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  cacheSize: number = 100
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Implement LRU by removing oldest entry if cache is full
    if (cache.size > cacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T;
}

import React from "react";

