'use client';

import { useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
// import { useToast } from '@/hooks/use-toast';

export interface KtvCategoryRelation {
  ktv_id: string;
  category_id: string;
}

export function useKtvCategories() {
  const supabase = useMemo(() => createClient(), []);

  const addCategoriesToKtv = useCallback(async (
    ktvId: string, 
    categoryIds: string[]
  ) => {
    try {
      if (categoryIds.length === 0) {
        return { success: true, error: null };
      }

      // Prepare the relations data
      const relations: Omit<KtvCategoryRelation, 'created_at'>[] = categoryIds.map((categoryId) => ({
        ktv_id: ktvId,
        category_id: categoryId
      }));

      // Insert all relations
      const { error } = await supabase
        .from('ktv_categories')
        .insert(relations);

      if (error) {
        throw error;
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error adding categories to KTV:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const removeCategoryFromKtv = useCallback(async (ktvId: string, categoryId: string) => {
    try {
      const { error } = await supabase
        .from('ktv_categories')
        .delete()
        .eq('ktv_id', ktvId)
        .eq('category_id', categoryId);

      if (error) {
        throw error;
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error removing category from KTV:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const updateKtvCategories = useCallback(async (
    ktvId: string, 
    categoryIds: string[],
    showToast: boolean = true
  ) => {
    try {
      // First, remove all existing categories for this KTV
      await supabase
        .from('ktv_categories')
        .delete()
        .eq('ktv_id', ktvId);

      // Then add the new categories
      if (categoryIds.length > 0) {
        const relations = categoryIds.map((categoryId) => ({
          ktv_id: ktvId,
          category_id: categoryId
        }));

        const { error } = await supabase
          .from('ktv_categories')
          .insert(relations);

        if (error) {
          throw error;
        }
      }


      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating KTV categories:', error);
      return { success: false, error };
    }
  }, [supabase]);

  const getKtvCategories = useCallback(async (ktvId: string) => {
    try {
      const { data, error } = await supabase
        .from('ktv_categories')
        .select(`
          category_id,
          categories (
            id,
            name,
            slug,
            description
          )
        `)
        .eq('ktv_id', ktvId);

      if (error) {
        throw error;
      }

      return { 
        success: true, 
        data: data || [], 
        error: null 
      };
    } catch (error: any) {
      console.error('Error getting KTV categories:', error);
      return { 
        success: false, 
        data: [], 
        error 
      };
    }
  }, [supabase]);

  return {
    addCategoriesToKtv,
    removeCategoryFromKtv,
    updateKtvCategories,
    getKtvCategories
  };
}
