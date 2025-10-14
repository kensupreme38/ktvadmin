'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KtvImage {
  imageUrl: string;
  ktv_id: string;
  image_id: string;
  is_main: boolean;
  order_index: number;
  created_at: string;
}

export interface Ktv {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  price: string;
  hours: string;
  contact?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KtvWithImages extends Ktv {
  images: KtvImage[];
  categories: any[];
  main_image_url?: string;
}

export function useKtvs(searchTerm?: string, page?: number, pageSize?: number) {
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const [ktvs, setKtvs] = useState<KtvWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadKtvs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('No authenticated user');
      }
      
      // Build query with search and pagination
      let query = supabase
        .from('ktvs')
        .select(`
          *,
          ktv_images (
            ktv_id,
            image_id,
            is_main,
            order_index,
            created_at,
            images (
              id,
              image_url
            )
          ),
          ktv_categories (
            category_id,
            categories (
              id,
              name,
              slug,
              description
            )
          )
        `, { count: 'exact' })

      // Add search filter if searchTerm is provided
      if (searchTerm && searchTerm.trim()) {
        query = query.ilike('name', `%${searchTerm.trim()}%`);
      }

      // Add pagination
      const currentPage = page || 1;
      const currentPageSize = pageSize || 10;
      const from = (currentPage - 1) * currentPageSize;
      const to = from + currentPageSize - 1;

      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data: ktvsData, error: ktvsError, count } = await query;

      if (ktvsError) {
        throw ktvsError;
      }

      // Transform data to include images and categories arrays
      const ktvsWithImages: KtvWithImages[] = (ktvsData || []).map((ktv: any) => ({
        ...ktv,
        images: ktv.ktv_images?.map((ki: any) => ({
          ...ki,
          imageUrl: ki.images?.image_url
        })).filter((img: any) => img.imageUrl) || [],
        categories: ktv.ktv_categories?.map((kc: any) => kc.categories).filter(Boolean) || []
      }));

      setKtvs(ktvsWithImages);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('Error loading KTVs:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading KTVs',
        description: error.message || 'Failed to load KTVs'
      });
      setKtvs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast, searchTerm, page, pageSize]);

  useEffect(() => {
    loadKtvs();
  }, [loadKtvs]);

  const createKtv = useCallback(async (ktvData: Omit<Ktv, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('No authenticated user');
      }

      // Create KTV with user_id
      const { data: newKtv, error: ktvError } = await supabase
        .from('ktvs')
        .insert([{ ...ktvData, user_id: user.id }])
        .select()
        .single();

      if (ktvError) {
        throw ktvError;
      }

      // Reload KTVs to get the new one with images
      await loadKtvs();
      
      return newKtv;
    } catch (error: any) {
      console.error('Error creating KTV:', error);
      throw error;
    }
  }, [supabase, loadKtvs]);

  const updateKtv = useCallback(async (id: string, updates: Partial<Ktv>, reloadData: boolean = true) => {
    try {
      const { error } = await supabase
        .from('ktvs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      if (reloadData) {
        await loadKtvs();
      }
    } catch (error: any) {
      console.error('Error updating KTV:', error);
      throw error;
    }
  }, [supabase, loadKtvs]);

  const deleteKtv = useCallback(async (id: string) => {
    try {
      // Delete KTV (ktv_images will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('ktvs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await loadKtvs();
    } catch (error: any) {
      console.error('Error deleting KTV:', error);
      throw error;
    }
  }, [supabase, loadKtvs]);

  const getKtvById = useCallback((id: string) => {
    return ktvs.find(ktv => ktv.id === id);
  }, [ktvs]);

  return {
    ktvs,
    totalCount,
    isLoading,
    createKtv,
    updateKtv,
    deleteKtv,
    getKtvById,
    refreshKtvs: loadKtvs
  };
}
