"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

type UseCategoriesResult = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  createCategory: (input: { name: string; slug: string; description?: string | null }) => Promise<{ category?: Category; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success?: true; error?: string }>;
};

export function useCategories(): UseCategoriesResult {
  const supabase = useMemo(() => createClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else if (data) {
      setCategories(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
        }))
      );
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const createCategory = useCallback(
    async (input: { name: string; slug: string; description?: string | null }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: input.name,
          slug: input.slug,
          description: input.description ?? null,
        })
        .select('id, name, slug, description')
        .single();

      if (error) {
        const raw = error.message.toLowerCase();
        const conflict = raw.includes('duplicate') || raw.includes('unique') || raw.includes('already exists');
        return { error: conflict ? 'Slug already exists' : error.message };
      }

      const newCat: Category = {
        id: (data as any).id,
        name: (data as any).name,
        slug: (data as any).slug,
        description: (data as any).description || '',
      };
      setCategories(prev => [newCat, ...prev]);
      return { category: newCat };
    },
    [supabase]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<{ success?: true; error?: string }> => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        return { error: error.message };
      }
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true as const };
    },
    [supabase]
  );

  return { categories, isLoading, error, reload: load, createCategory, deleteCategory };
}


