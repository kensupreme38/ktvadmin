# 🔧 Fix Session/Unauthorized Error

## ❌ **Problem:**

```
Create failed
Unauthorized - Please sign in
```

## 🔍 **Possible Causes:**

### **1. Session Expired**

- User session has expired
- Need to sign in again

### **2. Server Not Running**

- Dev server might be stopped
- Need to restart `npm run dev`

### **3. Profile Still Missing**

- User profile not created properly
- Need to run SQL fix again

---

## ✅ **SOLUTION STEPS:**

### **Step 1: Restart Dev Server**

```bash
# Stop current server (Ctrl+C if running)
# Then restart:
npm run dev
```

### **Step 2: Sign In Again**

1. Go to: http://localhost:9002/login
2. Sign in with: `test@gmail.com`
3. Make sure you're redirected to `/admin`

### **Step 3: Check Profile Exists**

Go to Supabase SQL Editor:
👉 **https://supabase.com/dashboard/project/bgorfttjlqffhbqdoyzg/editor**

Run this query:

```sql
SELECT id, email, role FROM users WHERE email = 'test@gmail.com';
```

**Expected result:** Should show `role = 'admin'`

### **Step 4: If Profile Missing, Run SQL Fix**

If the query above returns empty or `role != 'admin'`, run this:

```sql
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  '129a3521-8cd6-43fb-a79c-aa88edc84784',
  'test@gmail.com',
  'Test Admin',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
```

### **Step 5: Test User Creation**

1. Go to: http://localhost:9002/admin/users
2. Click "Add User"
3. Fill form:
   ```
   Full Name: Test User
   Email: testuser@example.com
   Password: password123
   Role: Editor
   ```
4. Click "Create User"
5. ✅ Should work!

---

## 🧪 **Debug Steps:**

### **Check 1: Dev Server**

```bash
# Should show:
# Local: http://localhost:9002
# Ready in 2.3s
```

### **Check 2: Browser Console**

- Open DevTools (F12)
- Check for JavaScript errors
- Look for network errors

### **Check 3: Supabase Dashboard**

- Go to Authentication → Users
- Verify `test@gmail.com` exists
- Check if user is confirmed

### **Check 4: Database**

- Go to Database → Table Editor → users
- Verify profile exists with `role = 'admin'`

---

## 💡 **Quick Fix:**

### **Method 1: Full Reset**

1. Restart dev server: `npm run dev`
2. Clear browser cache/cookies
3. Sign in again at `/login`
4. Test user creation

### **Method 2: Force Profile Update**

```sql
-- Force update profile
UPDATE users
SET role = 'admin', updated_at = NOW()
WHERE email = 'test@gmail.com';
```

### **Method 3: Check Environment**

Make sure `.env` file has correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bgorfttjlqffhbqdoyzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🎯 **Expected Flow:**

```
1. Start dev server ✅
2. Sign in at /login ✅
3. Redirected to /admin ✅
4. Go to /admin/users ✅
5. Click "Add User" ✅
6. Fill form ✅
7. Click "Create User" ✅
8. Success! ✅
```

---

## 🔧 **If Still Not Working:**

### **Check Server Actions:**

The error might be in the server action. Check browser Network tab:

1. Open DevTools → Network
2. Try creating user
3. Look for failed requests
4. Check response details

### **Check Middleware:**

Make sure middleware is working:

1. Try accessing `/admin` without signing in
2. Should redirect to `/login`
3. Sign in should redirect back to `/admin`

---

**Restart server + sign in again should fix the issue!** 🔧
