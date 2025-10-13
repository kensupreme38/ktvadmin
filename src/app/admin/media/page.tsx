"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGallery } from "@/components/admin/ImageGallery";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useStorageImages } from "@/hooks/use-storage-images";
import { createClient } from "@/lib/supabase/client";

const UploadingSkeleton = () => (
  <div className="relative aspect-square rounded-md overflow-hidden border-4 border-dashed border-primary/50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <p className="text-xs">Uploading...</p>
    </div>
  </div>
);

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const { uploadImagesAndCreateRecords } = useStorageImages();
  const [storageImages, setStorageImages] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  

  const loadFromStorage = useCallback(async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from('images')
      .select('id, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      toast({ variant: "destructive", title: "Error loading images", description: error.message });
      setStorageImages([]);
      setLoadingList(false);
      return;
    }

    const images = (data || []).map((row: any) => ({
      id: row.id,
      imageUrl: row.image_url as string,
      description: row.image_url.split('/').pop() || 'image',
      imageHint: 'db image',
    }));
    setStorageImages(images);
    setLoadingList(false);
  }, [supabase, toast]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const invalidCount = files.length - imageFiles.length;

    if (invalidCount > 0) {
      toast({
        variant: "destructive",
        title: "Some files were skipped",
        description: `${invalidCount} non-image file(s) ignored`,
      });
    }

    if (imageFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadingCount(imageFiles.length);

    try {
      // Upload and create DB records in public.images
      const { images, errors, dbError } = await uploadImagesAndCreateRecords(imageFiles);

      if (images.length > 0) {
        toast({ title: "Upload Successful!", description: `${images.length} image(s) uploaded to Storage` });
      }
      if (errors.length > 0) {
        toast({ variant: "destructive", title: "Some uploads failed", description: errors.slice(0, 3).join("; ") + (errors.length > 3 ? " ..." : "") });
      }
      if (dbError) {
        toast({ variant: 'destructive', title: 'Database insert failed', description: dbError });
      }

      await loadFromStorage();
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error while uploading your images.",
      });
    } finally {
      setIsUploading(false);
      setUploadingCount(0);
    }

    // Reset file input to allow same file re-selection
    event.target.value = "";
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Media Library</CardTitle>
        <Button onClick={handleUploadClick} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? `Uploading${uploadingCount > 1 ? ` (${uploadingCount})` : ""}...` : "Upload Images"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.avif,.bmp,.tif,.tiff,image/*"
        />
      </CardHeader>
      <CardContent>
        {loadingList ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading images from storage...</div>
        ) : storageImages.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No images found in storage.</div>
        ) : (
          <ImageGallery
            isUploading={isUploading}
            UploadingSkeleton={UploadingSkeleton}
            images={storageImages as any}
            emptyText="No images found in storage."
          />
        )}
      </CardContent>
    </Card>
  );
}
