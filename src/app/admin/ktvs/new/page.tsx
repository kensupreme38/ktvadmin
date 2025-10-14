
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { KtvForm } from '@/components/admin/KtvForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useKtvs } from '@/hooks/use-ktvs';
import { useKtvImages } from '@/hooks/use-ktv-images';
import { useKtvCategories } from '@/hooks/use-ktv-categories';

export default function NewKtvPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createKtv } = useKtvs();
  const { addImagesToKtv } = useKtvImages();
  const { addCategoriesToKtv } = useKtvCategories();
  const formRef = useRef<{ submit: () => void }>(null);

  const handleSave = async (formData: any) => {
    try {
      const { selectedImageIds, selectedCategoryIds, ...ktvData } = formData;
      
      // Create KTV first
      const newKtv = await createKtv({
        ...ktvData,
        slug: ktvData.slug || ktvData.name.toLowerCase().replace(/\s+/g, '-'),
      });

      // Add images to KTV if any were selected
      if (selectedImageIds && selectedImageIds.length > 0) {
        await addImagesToKtv(
          newKtv.id,
          selectedImageIds,
          {
            mainImageId: selectedImageIds[0], // First image as main
            orderIndices: selectedImageIds.map((_: string, index: number) => index)
          }
        );
      }

      // Add categories to KTV if any were selected
      if (selectedCategoryIds && selectedCategoryIds.length > 0) {
        try {
          await addCategoriesToKtv(newKtv.id, selectedCategoryIds);
        } catch (categoryError) {
          console.warn('Could not add categories to KTV:', categoryError);
          // Don't fail the entire operation if categories fail
        }
      }

      toast({
        title: 'New KTV Created!',
        description: `${newKtv.name} has been added to the directory.`,
      });

      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating KTV',
        description: error.message || 'Failed to create KTV'
      });
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  const triggerFormSubmit = () => {
    formRef.current?.submit();
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Add New KTV</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <KtvForm ref={formRef} onSave={handleSave} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={triggerFormSubmit}>Save</Button>
      </CardFooter>
    </Card>
  );
}
