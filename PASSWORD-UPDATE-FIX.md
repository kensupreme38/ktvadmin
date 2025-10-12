# 🔧 Password Update Fix

## ❌ **Problem:**

After updating user password, the user cannot login with the new password.

## 🔍 **Possible Causes:**

### **1. Password Hashing Issue**

- Supabase might not be hashing the password correctly
- Admin client update might have different behavior

### **2. Session Cache**

- User's session might be cached
- Browser might be using old credentials

### **3. Password Requirements**

- New password doesn't meet requirements
- Special characters or length issues

---

## ✅ **SOLUTIONS:**

### **Solution 1: Enhanced Password Update**

Update the password update function to be more robust:

```ts
// Update password if provided
if (formData.password) {
  // Validate password length
  if (formData.password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const { error: passwordError } = await adminClient.auth.admin.updateUserById(
    userId,
    {
      password: formData.password,
      // Force email confirmation if needed
      email_confirm: true,
    }
  );

  if (passwordError) {
    console.error("Password update error:", passwordError);
    return { error: `Password update failed: ${passwordError.message}` };
  }
}
```

### **Solution 2: Test Password Update**

1. **Update password via admin panel**
2. **Test login immediately:**
   - Open incognito/private window
   - Go to `/login`
   - Try new password
   - ✅ Should work

### **Solution 3: Force Password Reset**

If direct update doesn't work, use password reset flow:

```ts
// Alternative: Send password reset email
const { error: resetError } = await adminClient.auth.admin.generateLink({
  type: "recovery",
  email: userEmail,
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
  },
});
```

---

## 🧪 **Testing Steps:**

### **Step 1: Update Password**

1. Go to `/admin/users`
2. Click ⋯ → Edit on any user
3. Enter new password: `newpassword123`
4. Click "Update User"
5. ✅ Should show success

### **Step 2: Test Login**

1. **Open incognito window** (important!)
2. Go to `/login`
3. Use user's email and new password
4. ✅ Should login successfully

### **Step 3: If Still Fails**

1. Check browser console for errors
2. Try different password
3. Use password reset email instead

---

## 🔧 **Enhanced Update Function:**

```ts
export async function updateUser(
  userId: string,
  formData: {
    fullName?: string;
    role?: "admin" | "editor" | "user";
    password?: string;
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
    if (formData.fullName || formData.role) {
      const { error: profileError } = await adminClient
        .from("users")
        .update({
          ...(formData.fullName && { full_name: formData.fullName }),
          ...(formData.role && { role: formData.role }),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        return { error: profileError.message };
      }
    }

    // Update password if provided
    if (formData.password) {
      // Validate password
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
          details: passwordError.message,
        };
      }

      // Log success for debugging
      console.log(`Password updated for user: ${userData?.email}`);
    }

    revalidatePath("/admin/users");
    return {
      success: true,
      message: formData.password
        ? "User and password updated successfully!"
        : "User updated successfully!",
    };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user. Please try again." };
  }
}
```

---

## 💡 **Debug Tips:**

### **1. Check Password Requirements:**

- Minimum 6 characters
- No special requirements in Supabase by default
- Try simple passwords like `password123`

### **2. Test in Incognito:**

- Always test password changes in incognito window
- Clears any cached sessions
- Eliminates browser cache issues

### **3. Check Supabase Logs:**

- Go to Supabase Dashboard → Logs
- Look for authentication errors
- Check for password update failures

### **4. Alternative: Reset Password Email:**

Instead of direct update, send reset email:

```ts
await adminClient.auth.admin.generateLink({
  type: "recovery",
  email: userEmail,
});
```

---

## 🎯 **Expected Flow:**

```
1. Admin updates password ✅
2. Password is hashed by Supabase ✅
3. User tries new password ✅
4. Login succeeds ✅
```

**If step 4 fails, use incognito window or reset email method!**

---

**Password update should work with proper testing method!** 🔧
