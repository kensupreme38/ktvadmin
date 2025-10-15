
'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { useKtvs } from '@/hooks/use-ktvs';
import { useKtvImages } from '@/hooks/use-ktv-images';
import { useKtvCategories } from '@/hooks/use-ktv-categories';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load KtvForm
const KtvForm = dynamic(() => import('@/components/admin/KtvForm').then(mod => ({ default: mod.KtvForm })), {
  loading: () => <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>,
  ssr: false
});

const EditPageSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
)

export default function EditKtvPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { ktvs, updateKtv, isLoading, refreshKtvs } = useKtvs();
  const { updateKtvImages } = useKtvImages();
  const { updateKtvCategories } = useKtvCategories();
  const formRef = useRef<{ submit: () => void }>(null);

  const ktvId = typeof params.id === 'string' ? params.id : '';
  const ktv = ktvs.find(k => k.id === ktvId);

  const handleSave = async (formData: any) => {
    try {
      const { selectedImageIds, selectedCategoryIds, mainImageId, ...ktvData } = formData;
      
      
      // Update KTV basic info (without mainImageId)
      await updateKtv(ktvId, ktvData, false); // Don't reload data

      // Update images - always include main image if it exists
      const allImageIds = [];
      if (mainImageId) {
        allImageIds.push(mainImageId); // Main image first
      }
      if (selectedImageIds && selectedImageIds.length > 0) {
        // Add gallery images, excluding main image if it's already in gallery
        const galleryImages = selectedImageIds.filter((id: string) => id !== mainImageId);
        allImageIds.push(...galleryImages);
      }

      // Update ktv_images relationship
      try {
        await updateKtvImages(
          ktvId,
          allImageIds,
          {
            mainImageId: mainImageId, // Main image ID
            orderIndices: allImageIds.map((_: string, index: number) => index)
          }
        );
      } catch (imageError) {
        console.warn('Could not update KTV images:', imageError);
        // Don't fail the entire operation if images fail
      }

      // Update categories if provided
      if (selectedCategoryIds && selectedCategoryIds.length > 0) {
        try {
          await updateKtvCategories(ktvId, selectedCategoryIds);
        } catch (categoryError) {
          console.warn('Could not update KTV categories:', categoryError);
          // Don't fail the entire operation if categories fail
        }
      }

      // Reload data to show updated KTV
      await refreshKtvs();

      toast({
        title: 'KTV Updated!',
        description: `${ktvData.name} has been successfully updated.`,
      });
      router.push(`/admin/ktvs/${ktvId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating KTV',
        description: error.message || 'Failed to update KTV'
      });
    }
  };

  const handleCancel = () => {
    router.push(`/admin/ktvs/${ktvId}`);
  };

  const triggerFormSubmit = () => {
    formRef.current?.submit();
  }

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  if (!ktv) {
    return (
        <div className="text-center py-10">
            <p className="text-lg font-semibold">KTV not found</p>
            <Button onClick={() => router.push('/admin')} className="mt-4">Go Back to List</Button>
        </div>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Edit KTV: {ktv.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <KtvForm ref={formRef} ktv={ktv} onSave={handleSave} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={triggerFormSubmit}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
