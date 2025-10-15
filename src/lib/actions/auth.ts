"use server";

/**
 * Server Actions for Authentication
 */

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Handle common Supabase errors
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password" };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please confirm your email before signing in" };
    }
    return { error: "Sign in failed. Please try again." };
  }

  // Check if user account is blocked
  if (data.user) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_blocked")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("Error checking user status:", userError);
    }

    if (userData?.is_blocked) {
      // Sign out the user immediately
      await supabase.auth.signOut();
      return { 
        error: "Your account has been blocked. Please contact the administrator for more information." 
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    // Handle common Supabase errors
    if (error.message.includes("already registered")) {
      return { error: "This email is already registered" };
    }
    if (error.message.includes("Password should be")) {
      return { error: "Password must be at least 6 characters" };
    }
    return { error: "Sign up failed. Please try again." };
  }

  // Create user record in public.users table
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      role: "user", // Default role
    });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
    }
  }

  return {
    success: true,
    message:
      "Sign up successful! Please check your email to confirm your account.",
  };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: "Unable to sign out. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    profile,
  };
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
  });

  if (error) {
    if (error.message.includes("not found")) {
      return { error: "Email not found in the system" };
    }
    return { error: "Unable to send email. Please try again." };
  }

  return {
    success: true,
    message: "Password reset email sent! Please check your inbox.",
  };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    if (error.message.includes("Password should be")) {
      return { error: "Password must be at least 6 characters" };
    }
    return { error: "Unable to update password. Please try again." };
  }

  return {
    success: true,
    message: "Password updated successfully!",
  };
}
