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
          main_image_url?: string;
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
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          main_image_url?: string;
          address: string;
          city: string;
          country: string;
          phone: string;
          price: string;
          hours: string;
          contact?: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          main_image_url?: string;
          address?: string;
          city?: string;
          country?: string;
          phone?: string;
          price?: string;
          hours?: string;
          contact?: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };

      // Images Table
      images: {
        Row: {
          id: string;
          user_id: string | null;
          image_url: string;
          title: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          image_url: string;
          title?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          image_url?: string;
          title?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };

      // KTV Images Table
      ktv_images: {
        Row: {
          ktv_id: string;
          image_id: string;
          is_main: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          ktv_id: string;
          image_id: string;
          is_main?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          ktv_id?: string;
          image_id?: string;
          is_main?: boolean;
          order_index?: number;
          created_at?: string;
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

      // KTV Categories Table (Junction table)
      ktv_categories: {
        Row: {
          ktv_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          ktv_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          ktv_id?: string;
          category_id?: string;
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
