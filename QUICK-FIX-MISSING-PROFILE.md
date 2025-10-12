# 🔧 Quick Fix: Missing User Profile

## ❌ **Problem:**

```
Create failed
Forbidden - Admin access required
```

## 🔍 **Root Cause:**

User `test@gmail.com` exists in **auth.users** but **NOT in users table**.

**What happens:**

1. ✅ You can sign in with `test@gmail.com`
2. ❌ But `currentProfile` is `null` (no profile in users table)
3. ❌ `currentProfile?.role !== "admin"` fails
4. ❌ Shows "Forbidden" error

---

## ✅ **QUICK FIX:**

### **Method 1: Create Profile (Recommended)**

Go to Supabase SQL Editor:
👉 **https://supabase.com/dashboard/project/bgorfttjlqffhbqdoyzg/editor**

**Step 1:** Find your auth user ID

```sql
SELECT id, email FROM auth.users WHERE email = 'test@gmail.com';
```

**Step 2:** Create profile (replace UUID with actual ID from Step 1)

```sql
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  'your-auth-user-id-here',  -- Copy from Step 1
  'test@gmail.com',
  'Test Admin',
  'admin',
  NOW(),
  NOW()
);
```

**Step 3:** Verify

```sql
SELECT id, email, role FROM users WHERE email = 'test@gmail.com';
```

---

### **Method 2: Update Existing Profile**

If profile already exists but role is wrong:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'test@gmail.com';
```

---

### **Method 3: Via Dashboard (Easiest)**

1. **Go to Database → Table Editor → users**
2. **Click "Insert" → "Insert row"**
3. **Fill:**
   ```
   id: [Copy from auth.users]
   email: test@gmail.com
   full_name: Test Admin
   role: admin
   created_at: [Current timestamp]
   updated_at: [Current timestamp]
   ```
4. **Save**

---

## 🧪 **Test After Fix:**

1. **Refresh:** http://localhost:9002/admin/users
2. **Click "Add User"**
3. **Fill form:**
   ```
   Full Name: New User
   Email: newuser@test.com
   Password: password123
   Role: Editor
   ```
4. **Click "Create User"**
5. ✅ **Should work!**

---

## 🔍 **Debug Steps:**

### **Check auth user:**

```sql
SELECT id, email FROM auth.users WHERE email = 'test@gmail.com';
```

### **Check profile:**

```sql
SELECT * FROM users WHERE email = 'test@gmail.com';
```

### **Expected result:**

- ✅ Auth user exists
- ✅ Profile exists with `role = 'admin'`

---

## 💡 **Why This Happens:**

When you create a user via Supabase Dashboard → Auth → Users:

- ✅ Creates entry in `auth.users`
- ❌ Does NOT create entry in `users` table
- ❌ No profile = no role = no permissions

**Solution:** Create the profile manually!

---

## 🚀 **One-Line Fix:**

If you know your auth user ID:

```sql
INSERT INTO users (id, email, full_name, role) VALUES ('auth-id', 'test@gmail.com', 'Test Admin', 'admin');
```

---

**Create the missing profile and user management will work!** 🔧
