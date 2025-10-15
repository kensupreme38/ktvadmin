
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { KtvForm } from '@/components/admin/KtvForm';
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useKtvs } from '@/hooks/use-ktvs';
import { useKtvImages } from '@/hooks/use-ktv-images';
import { useKtvCategories } from '@/hooks/use-ktv-categories';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { ktvs, updateKtv, isLoading } = useKtvs();
  const { updateKtvImages, addImagesToKtv } = useKtvImages();
  const { updateKtvCategories } = useKtvCategories();
  const supabase = createClient();
  const formRef = useRef<{ submit: () => void }>(null);

  const ktvId = typeof params.id === 'string' ? params.id : '';
  const ktv = ktvs.find(k => k.id === ktvId);

  const handleSave = async (formData: any) => {
    try {
      const { selectedImageIds, selectedCategoryIds, mainImageId, ...ktvData } = formData;
      
      // Update KTV basic info
      await updateKtv(ktvId, ktvData, false); // Don't reload data

      // Handle main image and gallery images separately
      try {
        // First, remove all existing images
        const { error: deleteError } = await supabase
          .from('ktv_images')
          .delete()
          .eq('ktv_id', ktvId);

        if (deleteError) {
          throw deleteError;
        }

        // Add main image if provided
        if (mainImageId) {
          await addImagesToKtv(
            ktvId,
            [mainImageId],
            {
              mainImageId: mainImageId,
              orderIndices: [0]
            }
          );
        }

        // Add gallery images if provided
        if (selectedImageIds && selectedImageIds.length > 0) {
          await addImagesToKtv(
            ktvId,
            selectedImageIds,
            {
              mainImageId: undefined, // No main image for gallery
              orderIndices: selectedImageIds.map((_: string, index: number) => index + (mainImageId ? 1 : 0))
            }
          );
        }
      } catch (imageError) {
        console.warn('Could not update KTV images:', imageError);
        // Don't fail the entire operation if images fail
      }

      // Update categories if provided
      if (selectedCategoryIds !== undefined) {
        try {
          await updateKtvCategories(ktvId, selectedCategoryIds);
        } catch (categoryError) {
          console.warn('Could not update KTV categories:', categoryError);
          // Don't fail the entire operation if categories fail
        }
      }

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
