/**
 * Auth utilities and permission checks
 */

import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "editor" | "user";

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role || "user";
}

export async function requireAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  const role = await getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  return { user, role };
}

export async function isAdmin() {
  const role = await getUserRole();
  return role === "admin";
}

export async function canEdit() {
  const role = await getUserRole();
  return role === "admin" || role === "editor";
}
