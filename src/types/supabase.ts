/**
 * Supabase Database Types
 *
 * Để generate types từ database schema, chạy:
 * npx supabase gen types typescript --project-id bgorgfttjlfqhbqdozqg > src/types/supabase.ts
 *
 * Hoặc sử dụng Supabase CLI:
 * supabase gen types typescript --linked > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Thêm các types cho tables của bạn ở đây
// Ví dụ:

export interface Database {
  public: {
    Tables: {
      // KTV Table
      ktvs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string;
          district: string;
          phone: string;
          description: string | null;
          rating: number;
          review_count: number;
          price_range: string;
          amenities: string[];
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address: string;
          district: string;
          phone: string;
          description?: string | null;
          rating?: number;
          review_count?: number;
          price_range: string;
          amenities?: string[];
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          address?: string;
          district?: string;
          phone?: string;
          description?: string | null;
          rating?: number;
          review_count?: number;
          price_range?: string;
          amenities?: string[];
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };

      // Categories Table
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };

      // Articles Table
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          featured_image: string | null;
          category_id: string | null;
          author_id: string | null;
          status: "draft" | "published";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          featured_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Users Table
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "editor" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "editor" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "editor" | "user";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
