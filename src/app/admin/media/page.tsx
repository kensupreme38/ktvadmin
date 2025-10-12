
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageGallery } from '@/components/admin/ImageGallery';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { optimizeImage, type OptimizeImageOutput } from '@/ai/flows/optimize-image';
import { Skeleton } from '@/components/ui/skeleton';

const UploadingSkeleton = () => (
  <div className="relative aspect-square rounded-md overflow-hidden border-4 border-dashed border-primary/50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <p className="text-xs">Optimizing with AI...</p>
    </div>
  </div>
);

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [key, setKey] = useState(Date.now());

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please select an image file.',
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const imageDataUri = reader.result as string;
        
        toast({
          title: 'Optimizing Image...',
          description: 'The AI is enhancing your image. This may take a moment.',
        });

        const result = await optimizeImage({ image: imageDataUri });

        const existingImages = JSON.parse(localStorage.getItem('user_uploaded_images') || '[]');
        const newImage = {
          id: `user_${Date.now()}`,
          imageUrl: result.optimizedImage,
          description: result.description,
          imageHint: 'uploaded image',
        };
        const updatedImages = [newImage, ...existingImages];
        localStorage.setItem('user_uploaded_images', JSON.stringify(updatedImages));

        toast({
          title: 'Upload Successful!',
          description: 'Your optimized image has been added to the library.',
        });
        
        // Force re-render of ImageGallery
        setKey(Date.now());

      } catch (error) {
        console.error('Error optimizing image:', error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was an error while optimizing your image.',
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
        });
        setIsUploading(false);
    };

    // Reset file input
    event.target.value = '';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Media Library</CardTitle>
        <Button onClick={handleUploadClick} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </CardHeader>
      <CardContent>
        <ImageGallery key={key} isUploading={isUploading} UploadingSkeleton={UploadingSkeleton} />
      </CardContent>
    </Card>
  );
}
