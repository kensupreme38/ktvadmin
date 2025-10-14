"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, PlusCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  PlaceHolderImages as defaultImages,
  type ImagePlaceholder,
} from "@/lib/placeholder-images";

interface ImageGalleryProps {
  onSelect?: (urls: string[]) => void;
  multiple?: boolean;
  onClose?: () => void;
  isUploading?: boolean;
  UploadingSkeleton?: React.ComponentType;
  images?: ImagePlaceholder[]; // optional external images source
  emptyText?: string;
  onRefresh?: () => void; // callback for refresh action
}

export function ImageGallery({
  onSelect,
  multiple = false,
  onClose,
  isUploading = false,
  UploadingSkeleton,
  images,
  emptyText,
  onRefresh,
}: ImageGalleryProps) {
  const [selectedImages, setSelectedImages] = useState<ImagePlaceholder[]>([]);
  const [combinedImages, setCombinedImages] = useState<ImagePlaceholder[]>([]);

  useEffect(() => {
    if (images) {
      setCombinedImages(images);
      return;
    }
    const userUploadedImages = JSON.parse(
      localStorage.getItem("user_uploaded_images") || "[]"
    );
    setCombinedImages([...userUploadedImages, ...defaultImages]);
  }, [images]);

  const handleImageClick = (image: ImagePlaceholder) => {
    if (!onSelect) return;

    if (multiple) {
      setSelectedImages((prev) =>
        prev.some((i) => i.id === image.id)
          ? prev.filter((i) => i.id !== image.id)
          : [...prev, image]
      );
    } else {
      setSelectedImages([image]);
    }
  };

  const handleConfirmSelection = () => {
    if (onSelect) {
      const selectedIds = selectedImages.map((img) => img.id);
      onSelect(selectedIds);
      setSelectedImages([]);
    }
  };

  const isSelected = (image: ImagePlaceholder) => {
    return selectedImages.some((i) => i.id === image.id);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {isUploading && UploadingSkeleton && <UploadingSkeleton />}
          {combinedImages.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-10">
              {emptyText || "No images available."}
            </div>
          )}
          {combinedImages.map((image) => (
            <div
              key={image.id}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden group cursor-pointer border-4 border-transparent",
                isSelected(image) && "border-primary"
              )}
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={image.imageUrl.startsWith("data:image")}
                loading="lazy"
                quality={75}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isSelected(image) ? (
                <CheckCircle className="absolute top-2 right-2 h-6 w-6 text-white bg-primary rounded-full p-1" />
              ) : (
                onSelect && (
                  <PlusCircle className="absolute top-2 right-2 h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs truncate">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {onSelect && (
        <div className="p-4 border-t flex justify-between items-center">
          <div className="flex gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={selectedImages.length === 0}
            >
              {`Select ${
                selectedImages.length > 0 ? selectedImages.length : ""
              } Image(s)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
