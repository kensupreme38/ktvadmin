
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageGallery } from '@/components/admin/ImageGallery';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MediaLibraryPage() {
  const { toast } = useToast();

  const handleUpload = () => {
    // In a real app, this would open a file dialog and handle uploads.
    // For now, we'll just show a toast as a placeholder.
    toast({
      title: 'Feature Coming Soon!',
      description: 'Image upload functionality is under development.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Media Library</CardTitle>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </CardHeader>
      <CardContent>
        <ImageGallery />
      </CardContent>
    </Card>
  );
}
