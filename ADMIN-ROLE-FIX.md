# 🔧 Fix Admin Role Issue

## ❌ **Problem:**

```
Create failed
Forbidden - Admin access required
```

## 🔍 **Root Cause:**

Your user account exists in Supabase Auth, but doesn't have `role = 'admin'` in the `users` table.

**The check fails here:**

```ts
if (currentProfile?.role !== "admin") {
  return { error: "Forbidden - Admin access required" };
}
```

---

## ✅ **Solution:**

### **Step 1: Find Your User Info**

Go to Supabase SQL Editor:
👉 **https://supabase.com/dashboard/project/bgorfttjlqffhbqdoyzg/editor**

Run this query to see all users:

```sql
SELECT
  au.id as auth_id,
  au.email as auth_email,
  u.id as profile_id,
  u.role,
  u.full_name
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
ORDER BY au.created_at DESC;
```

### **Step 2: Update Your Role to Admin**

Replace `'your-email@example.com'` with your actual email:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### **Step 3: Verify the Update**

```sql
SELECT
  id,
  email,
  full_name,
  role
FROM users
WHERE email = 'your-email@example.com';
```

Should show `role = 'admin'`.

---

## 🚀 **Alternative Methods:**

### **Method 1: Via Supabase Dashboard**

1. Go to **Authentication → Users**
2. Find your user
3. Go to **Database → Table Editor → users**
4. Find your row and change `role` to `'admin'`

### **Method 2: Direct Database Update**

If you know your user ID:

```sql
UPDATE users
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

### **Method 3: Create Admin Profile (if missing)**

If your profile doesn't exist in `users` table:

```sql
INSERT INTO users (id, email, full_name, role)
VALUES (
  'your-auth-user-id',
  'your-email@example.com',
  'Your Name',
  'admin'
);
```

---

## 🧪 **Test After Fix:**

1. **Refresh the page:** http://localhost:9002/admin/users
2. **Click "Add User"**
3. **Fill the form:**
   ```
   Full Name: Test User
   Email: test@example.com
   Password: password123
   Role: Editor
   ```
4. **Click "Create User"**
5. ✅ **Should work!**

---

## 📋 **Common Issues:**

### **Issue 1: Profile doesn't exist**

**Error:** `currentProfile` is `null`
**Fix:** Insert profile into `users` table

### **Issue 2: Role is null or wrong**

**Error:** Role check fails
**Fix:** Update role to `'admin'`

### **Issue 3: Case sensitivity**

**Error:** Role doesn't match
**Fix:** Use lowercase `'admin'` (not `'Admin'`)

---

## 🔍 **Debug Steps:**

### **1. Check your current role:**

```sql
SELECT role FROM users WHERE email = 'your-email@example.com';
```

### **2. Check if profile exists:**

```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

### **3. Check auth user:**

```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

---

## 💡 **Quick Fix:**

**If you just want to test immediately:**

1. Go to Supabase Dashboard
2. **Database → Table Editor → users**
3. Find your row
4. Change `role` column to `admin`
5. Save
6. Try creating user again!

---

## 🎯 **Expected Result:**

After fixing the role:

```
✅ User Management page loads
✅ "Add User" button works
✅ Form submits successfully
✅ New user appears in table
✅ No "Forbidden" errors
```

---

**Fix your role to 'admin' and user creation will work!** 🔧

_Run the SQL queries in Supabase Dashboard_
