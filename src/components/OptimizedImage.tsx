"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
  showLoader?: boolean;
  lowQualityPlaceholder?: string;
}

/**
 * Optimized Image component with:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder
 * - Error handling with fallback
 * - Loading state
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "https://placehold.co/400x300?text=No+Image",
  showLoader = true,
  lowQualityPlaceholder,
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const placeholderDataUrl =
    lowQualityPlaceholder ||
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN89+7dfwAJRQOi3pdVgQAAAABJRU5ErkJggg==";

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden bg-muted", className)}
      style={props.width && props.height ? {
        aspectRatio: `${props.width} / ${props.height}`
      } : undefined}
    >
      {isVisible ? (
        <>
          {showLoader && isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            className={cn(
              "transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              className
            )}
            placeholder="blur"
            blurDataURL={placeholderDataUrl}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}

export default OptimizedImage;

