"use server";

/**
 * Server Actions for User Management (Admin only)
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createUser(formData: {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "editor" | "user";
}) {
  try {
    // Check if current user is admin
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return { error: "Unauthorized - Please sign in" };
    }

    // Use admin client to check role (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: currentProfile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (currentProfile?.role !== "admin") {
      return { error: "Forbidden - Admin access required" };
    }

    // Create auth user
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: formData.fullName,
          role: formData.role,
        },
      });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return { error: "This email is already registered" };
      }
      return { error: authError.message };
    }

    // Create user profile (should be auto-created by trigger, but just in case)
    if (authData.user) {
      const { error: profileError } = await adminClient.from("users").upsert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        role: formData.role,
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User created successfully!",
      user: authData.user,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user. Please try again." };
  }
}

export async function updateUser(
  userId: string,
  formData: {
    fullName?: string;
    role?: "admin" | "editor" | "user";
    password?: string;
    isBlocked?: boolean;
  }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    // Use admin client to check role (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: currentProfile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (currentProfile?.role !== "admin") {
      return { error: "Admin access required" };
    }

    // Update user profile
    if (formData.fullName || formData.role || formData.isBlocked !== undefined) {
      const { error: profileError } = await adminClient
        .from("users")
        .update({
          ...(formData.fullName && { full_name: formData.fullName }),
          ...(formData.role && { role: formData.role }),
          ...(formData.isBlocked !== undefined && { is_blocked: formData.isBlocked }),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        return { error: profileError.message };
      }
    }

    // Update password if provided
    if (formData.password) {
      // Validate password length
      if (formData.password.length < 6) {
        return { error: "Password must be at least 6 characters" };
      }

      // Get user email for better error handling
      const { data: userData } = await adminClient
        .from("users")
        .select("email")
        .eq("id", userId)
        .single();

      const { error: passwordError } =
        await adminClient.auth.admin.updateUserById(userId, {
          password: formData.password,
          email_confirm: true, // Ensure email is confirmed
        });

      if (passwordError) {
        console.error("Password update error:", passwordError);
        return {
          error: `Password update failed: ${passwordError.message}`,
        };
      }

      // Log success for debugging
      console.log(`Password updated for user: ${userData?.email}`);
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User updated successfully!" };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user. Please try again." };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    // Use admin client to check role (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: currentProfile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (currentProfile?.role !== "admin") {
      return { error: "Admin access required" };
    }

    // Prevent deleting yourself
    if (currentUser.id === userId) {
      return { error: "You cannot delete your own account" };
    }

    // Delete auth user (cascade will delete profile)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      userId
    );

    if (deleteError) {
      return { error: deleteError.message };
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully!" };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user. Please try again." };
  }
}

export async function getUsers() {
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return { error: "Unauthorized", users: [] };
    }

    // Use admin client to fetch users (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: users, error } = await adminClient
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message, users: [] };
    }

    return { users: users || [] };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users", users: [] };
  }
}
