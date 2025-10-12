# 🧪 Comprehensive Authentication & User Management Test Plan

## 📋 **Test Checklist - Run All Tests**

### ✅ **Pre-Test Setup:**

1. Ensure dev server is running: `npm run dev`
2. Clear browser cache/cookies
3. Have test email ready: `test@gmail.com`

---

## 🔐 **AUTHENTICATION FLOWS**

### **Test 1: Sign In Flow**

**URL:** http://localhost:9002/login

#### **1.1 Valid Credentials**

- ✅ **Input:** `test@gmail.com` / `current_password`
- ✅ **Expected:** Redirect to `/admin`
- ✅ **Check:** No error messages

#### **1.2 Invalid Email**

- ✅ **Input:** `wrong@email.com` / `password`
- ✅ **Expected:** "Invalid email or password"
- ✅ **Check:** Error message displays

#### **1.3 Invalid Password**

- ✅ **Input:** `test@gmail.com` / `wrongpassword`
- ✅ **Expected:** "Invalid email or password"
- ✅ **Check:** Error message displays

#### **1.4 Empty Fields**

- ✅ **Input:** Empty email/password
- ✅ **Expected:** Form validation errors
- ✅ **Check:** Required field messages

#### **1.5 Redirect Logic**

- ✅ **Action:** Already logged in user visits `/login`
- ✅ **Expected:** Redirect to `/admin`
- ✅ **Check:** No login form shown

---

### **Test 2: Sign Out Flow**

**From:** Admin dashboard

#### **2.1 Sign Out Success**

- ✅ **Action:** Click user avatar → "Sign out"
- ✅ **Expected:** Redirect to `/login`
- ✅ **Check:** No error toast messages

#### **2.2 Sign Out from Different Locations**

- ✅ **Test:** Sign out from `/admin/users`
- ✅ **Test:** Sign out from `/admin/media`
- ✅ **Expected:** All redirect to `/login`

---

### **Test 3: Protected Routes**

**URLs:** `/admin/*`

#### **3.1 Unauthenticated Access**

- ✅ **Action:** Visit `/admin` without login
- ✅ **Expected:** Redirect to `/login`
- ✅ **Check:** URL includes redirect parameter

#### **3.2 Authenticated Access**

- ✅ **Action:** Visit `/admin` after login
- ✅ **Expected:** Access granted
- ✅ **Check:** Admin dashboard loads

---

## 👥 **USER MANAGEMENT FLOWS**

### **Test 4: User List (getUsers)**

**URL:** http://localhost:9002/admin/users

#### **4.1 Load Users**

- ✅ **Expected:** List all users from database
- ✅ **Check:** Users display with avatars, names, roles
- ✅ **Check:** Role badges show correct colors

#### **4.2 User Information Display**

- ✅ **Check:** Full name displays
- ✅ **Check:** Email displays
- ✅ **Check:** Role badge (admin=red, editor=blue, user=gray)
- ✅ **Check:** Join date displays

---

### **Test 5: Create User Flow**

**Action:** Click "Add User" button

#### **5.1 Form Display**

- ✅ **Expected:** Modal opens with form
- ✅ **Check:** All fields present (name, email, password, confirm, role)
- ✅ **Check:** Role dropdown has 3 options

#### **5.2 Form Validation**

- ✅ **Test:** Empty required fields
- ✅ **Expected:** Validation errors
- ✅ **Test:** Invalid email format
- ✅ **Expected:** "Please enter a valid email"

#### **5.3 Password Validation**

- ✅ **Test:** Password < 6 characters
- ✅ **Expected:** "Password must be at least 6 characters"
- ✅ **Test:** Password mismatch
- ✅ **Expected:** "Passwords don't match"

#### **5.4 Create User Success**

- ✅ **Input:**
  ```
  Full Name: Test Editor
  Email: editor@test.com
  Password: password123
  Confirm: password123
  Role: Editor
  ```
- ✅ **Expected:** Success toast, user appears in list
- ✅ **Check:** User can login immediately

#### **5.5 Create Duplicate Email**

- ✅ **Input:** Existing email address
- ✅ **Expected:** "This email is already registered"
- ✅ **Check:** Error message displays

---

### **Test 6: Edit User Flow**

**Action:** Click ⋯ → "Edit" on any user

#### **6.1 Form Pre-population**

- ✅ **Expected:** Form shows current user data
- ✅ **Check:** Email field is disabled
- ✅ **Check:** Password fields are empty

#### **6.2 Update Name Only**

- ✅ **Input:** Change full name
- ✅ **Expected:** Success, name updated in list
- ✅ **Check:** Other fields unchanged

#### **6.3 Update Role**

- ✅ **Input:** Change role (e.g., User → Editor)
- ✅ **Expected:** Success, badge color changes
- ✅ **Check:** Role updated in database

#### **6.4 Update Password**

- ✅ **Input:** New password: `newpassword123`
- ✅ **Expected:** Success message
- ✅ **Test:** User can login with new password (incognito window)

#### **6.5 Update All Fields**

- ✅ **Input:** Change name, role, and password
- ✅ **Expected:** All changes saved
- ✅ **Check:** All fields updated in list

---

### **Test 7: Delete User Flow**

**Action:** Click ⋯ → "Delete" on any user

#### **7.1 Confirmation Dialog**

- ✅ **Expected:** Alert dialog appears
- ✅ **Check:** Shows user name in confirmation
- ✅ **Check:** "Are you absolutely sure?" message

#### **7.2 Cancel Delete**

- ✅ **Action:** Click "Cancel"
- ✅ **Expected:** Dialog closes, user still in list
- ✅ **Check:** No changes made

#### **7.3 Confirm Delete**

- ✅ **Action:** Click "Delete" (red button)
- ✅ **Expected:** User removed from list
- ✅ **Expected:** Success toast message
- ✅ **Check:** User cannot login anymore

#### **7.4 Self-Delete Protection**

- ✅ **Action:** Try to delete your own account
- ✅ **Expected:** "You cannot delete your own account"
- ✅ **Check:** Error message, user not deleted

---

## 🔒 **PERMISSION & SECURITY TESTS**

### **Test 8: Admin Access Control**

#### **8.1 Non-Admin User**

- ✅ **Setup:** Create user with role "user"
- ✅ **Test:** Try to access `/admin/users`
- ✅ **Expected:** Access denied or redirect

#### **8.2 Editor User**

- ✅ **Setup:** Create user with role "editor"
- ✅ **Test:** Try to access `/admin/users`
- ✅ **Expected:** Access denied (should not manage users)

---

### **Test 9: Session Management**

#### **9.1 Session Persistence**

- ✅ **Action:** Login, close browser, reopen
- ✅ **Expected:** Still logged in
- ✅ **Check:** Can access admin dashboard

#### **9.2 Session Expiry**

- ✅ **Action:** Wait for session to expire
- ✅ **Expected:** Redirect to login
- ✅ **Check:** Cannot access protected routes

---

## 🔄 **INTEGRATION TESTS**

### **Test 10: Complete User Lifecycle**

#### **10.1 Full Workflow**

1. ✅ **Create** user via admin panel
2. ✅ **Login** with new user credentials
3. ✅ **Edit** user info via admin panel
4. ✅ **Test** updated credentials
5. ✅ **Delete** user via admin panel
6. ✅ **Verify** user cannot login

#### **10.2 Multiple Users**

- ✅ **Create** 3 users with different roles
- ✅ **Verify** all appear in user list
- ✅ **Test** login for each user
- ✅ **Edit** each user's role
- ✅ **Delete** all test users

---

## 🐛 **ERROR HANDLING TESTS**

### **Test 11: Network & Error Scenarios**

#### **11.1 Server Errors**

- ✅ **Simulate:** Network disconnection
- ✅ **Expected:** Appropriate error messages
- ✅ **Check:** No crashes, graceful handling

#### **11.2 Invalid Data**

- ✅ **Test:** SQL injection attempts in forms
- ✅ **Expected:** Proper sanitization
- ✅ **Check:** No database corruption

---

## 📱 **UI/UX TESTS**

### **Test 12: User Interface**

#### **12.1 Responsive Design**

- ✅ **Test:** Desktop, tablet, mobile views
- ✅ **Check:** Forms and tables adapt properly

#### **12.2 Loading States**

- ✅ **Check:** Loading spinners during operations
- ✅ **Check:** Disabled buttons during processing

#### **12.3 Toast Notifications**

- ✅ **Check:** Success messages appear
- ✅ **Check:** Error messages are clear
- ✅ **Check:** Messages auto-dismiss

---

## 🎯 **PASS/FAIL CRITERIA**

### **✅ All Tests Must Pass:**

- [ ] Sign in with valid credentials
- [ ] Sign out without errors
- [ ] Create user successfully
- [ ] Edit user information
- [ ] Update password works
- [ ] Delete user with confirmation
- [ ] Protected routes redirect properly
- [ ] Error messages are user-friendly
- [ ] No infinite recursion errors
- [ ] No unauthorized errors
- [ ] Admin client works consistently

### **❌ Common Issues to Check:**

- [ ] RLS infinite recursion
- [ ] Missing user profiles
- [ ] Session expiry issues
- [ ] Password update failures
- [ ] Permission denied errors

---

## 📝 **Test Results Template**

```
Test Date: ___________
Tester: ___________
Environment: Development

Authentication Tests:
□ Sign in valid credentials
□ Sign in invalid credentials
□ Sign out functionality
□ Protected route access

User Management Tests:
□ Create new user
□ Edit user information
□ Update password
□ Delete user
□ User list display

Error Handling Tests:
□ Invalid form data
□ Network errors
□ Permission errors

Overall Result: PASS / FAIL
Notes: ________________
```

---

**Run all tests systematically to ensure complete functionality!** 🧪✅
