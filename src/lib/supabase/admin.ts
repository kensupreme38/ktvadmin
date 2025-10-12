/**
 * Supabase Admin Client
 * Sử dụng Service Role Key cho admin operations
 * CHỈ SỬ DỤNG TRONG SERVER-SIDE CODE!
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for admin client");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
