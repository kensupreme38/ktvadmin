'use client';

import { useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
// import { useToast } from '@/hooks/use-toast';

export interface KtvImageRelation {
  ktv_id: string;
  image_id: string;
  is_main: boolean;
  order_index: number;
}

export function useKtvImages() {
  const supabase = useMemo(() => createClient(), []);

  const addImagesToKtv = useCallback(async (
    ktvId: string, 
    imageIds: string[], 
    options?: {
      mainImageId?: string;
      orderIndices?: number[];
    }
  ) => {
    try {
      if (imageIds.length === 0) {
        return { success: true, error: null };
      }

      // Prepare the relations data
      const relations: Omit<KtvImageRelation, 'created_at'>[] = imageIds.map((imageId, index) => {
        const isMain = options?.mainImageId !== undefined && options?.mainImageId === imageId;
        return {
          ktv_id: ktvId,
          image_id: imageId,
          is_main: isMain,
          order_index: options?.orderIndices?.[index] ?? index
        };
      });

      // Insert all relations
      const { error } = await supabase
        .from('ktv_images')
        .insert(relations);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error adding images to KTV:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const updateKtvImage = useCallback(async (
    ktvId: string,
    imageId: string,
    updates: {
      is_main?: boolean;
      order_index?: number;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('ktv_images')
        .update(updates)
        .eq('ktv_id', ktvId)
        .eq('image_id', imageId);

      if (error) {
        throw error;
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating KTV image:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const removeImageFromKtv = useCallback(async (ktvId: string, imageId: string) => {
    try {
      const { error } = await supabase
        .from('ktv_images')
        .delete()
        .eq('ktv_id', ktvId)
        .eq('image_id', imageId);

      if (error) {
        throw error;
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error removing image from KTV:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const setMainImage = useCallback(async (ktvId: string, imageId: string) => {
    try {
      // First, unset all main images for this KTV
      await supabase
        .from('ktv_images')
        .update({ is_main: false })
        .eq('ktv_id', ktvId);

      // Then set the specified image as main
      const { error } = await supabase
        .from('ktv_images')
        .update({ is_main: true })
        .eq('ktv_id', ktvId)
        .eq('image_id', imageId);

      if (error) {
        throw error;
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error setting main image:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const reorderImages = useCallback(async (ktvId: string, imageOrder: { imageId: string; order: number }[]) => {
    try {
      const updates = imageOrder.map(({ imageId, order }) =>
        supabase
          .from('ktv_images')
          .update({ order_index: order })
          .eq('ktv_id', ktvId)
          .eq('image_id', imageId)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Some images failed to reorder');
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error reordering images:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const updateKtvImages = useCallback(async (
    ktvId: string, 
    imageIds: string[], 
    options?: { mainImageId?: string; orderIndices?: number[]; showToast?: boolean }
  ) => {
    try {
      // First, remove all existing images for this KTV
      const { error: deleteError } = await supabase
        .from('ktv_images')
        .delete()
        .eq('ktv_id', ktvId);

      if (deleteError) {
        throw deleteError;
      }

      // Then add the new images
      if (imageIds.length > 0) {
        const relations = imageIds.map((imageId, index) => ({
          ktv_id: ktvId,
          image_id: imageId,
          is_main: imageId === options?.mainImageId,
          order_index: options?.orderIndices?.[index] ?? index,
          created_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('ktv_images')
          .insert(relations);

        if (insertError) {
          throw insertError;
        }
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating KTV images:', error);
      return { success: false, error };
    }
  }, [supabase]);

  return {
    addImagesToKtv,
    updateKtvImage,
    updateKtvImages,
    removeImageFromKtv,
    setMainImage,
    reorderImages
  };
}
