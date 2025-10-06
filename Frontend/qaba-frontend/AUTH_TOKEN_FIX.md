# Authentication Token Expiration Fix

## Problem Summary

Users were experiencing authentication token clearing approximately 4 minutes after logging in. Despite appearing to still be logged in (with cached user data visible), they would encounter 401 (Unauthorized) errors when making authenticated requests.

## Root Cause Analysis

### The Problem Chain:

1. **Backend JWT Token Expiration (~4 minutes)**
   - Backend JWT tokens were expiring after approximately 4 minutes
   - This was NOT a frontend timer issue

2. **NotificationContext Polling Trigger**
   - `NotificationContext` runs on both client and agent dashboards
   - It polls the notifications endpoint every 60 seconds
   - When tokens expired, the polling would fail with 401 errors but wouldn't handle them properly

3. **Silent Failure Pattern**
   - When tokens expired, the NotificationContext would log errors but not clear tokens or redirect
   - Tokens remained in localStorage until user attempted another action
   - This created a "phantom login" state where UI showed cached data but API calls failed

4. **Inconsistent Token Clearing**
   - Only PaymentButton and PaymentVerifier cleared tokens on 401 errors
   - Other parts of the app had no 401 error handling
   - No global mechanism to detect and handle expired sessions

## Solution Implemented

### 1. Global Authentication Handler (`src/utils/authHandler.js`)

Created a centralized authentication handler that:

- **Clears ALL user data** from localStorage, sessionStorage, and cookies
- **Handles 401 errors globally** with a single source of truth
- **Redirects to sign-in page** with session expiration message
- **Prevents multiple simultaneous redirects** with a flag mechanism
- **Provides authenticated fetch wrapper** for easy integration

Key Functions:
- `clearAllUserData()` - Removes all authentication and user-related data
- `handleSessionExpiration()` - Main handler for expired sessions
- `handle401Error()` - Detects and processes 401 responses
- `authenticatedFetch()` - Enhanced fetch with automatic 401 handling

### 2. Axios Interceptor (`src/utils/axiosConfig.js`)

Created a configured axios instance with interceptors that:

- **Automatically adds** auth token to all requests
- **Globally catches** all 401 errors from axios calls
- **Triggers session expiration handler** on 401 detection
- **Provides consistent error handling** across the app

### 3. Context Updates

Updated all contexts to use the global 401 handler:

#### NotificationContext (`src/contexts/NotificationContext.jsx`)
- Added 401 error detection in `fetchNotifications()`
- Added 401 error detection in `markAsRead()`
- Prevents silent failures by properly handling expired tokens during polling

#### ProfileContext (`src/contexts/ProfileContext.jsx`)
- Added 401 error detection in `fetchUserData()`
- Added 401 error detection in `fetchProfileData()`
- Ensures profile fetching doesn't continue with expired tokens

### 4. Payment Component Updates

Updated payment components to use the centralized handler:

#### PaymentButton (`src/app/components/PaymentButton.jsx`)
- Replaced local token clearing with `handle401Error()`
- Consistent behavior with rest of app

#### PaymentVerifier (`src/app/components/PaymentVerifier.jsx`)
- Replaced local token clearing with `handle401Error()`
- Immediate redirect on session expiration

### 5. Sign-In Page Enhancement

Updated sign-in page to show session expiration messages:

- Displays toast notification when redirected due to expired session
- Reads message from sessionStorage or URL parameter
- Provides clear feedback to users about why they were logged out

## How It Works Now

### Timeline Example:

```
T = 0:00    → User logs in, gets token
T = 1:00    → Notification poll succeeds ✓
T = 2:00    → Notification poll succeeds ✓
T = 3:00    → Notification poll succeeds ✓
T = 4:00    → TOKEN EXPIRES ON BACKEND 🔥
T = 4:01    → Notification poll detects 401
            → handle401Error() triggered
            → All user data cleared
            → Redirected to /signin?reason=expired
            → Toast message: "Your session has expired. Please log in again."
```

### User Experience:

**Before Fix:**
- ❌ User appears logged in but gets random 401 errors
- ❌ Confusing experience - UI shows user data but requests fail
- ❌ Token only cleared when attempting payment actions
- ❌ No clear feedback about what happened

**After Fix:**
- ✅ Immediate detection of expired session
- ✅ Automatic redirect to sign-in page
- ✅ Clear message explaining session expiration
- ✅ All user data properly cleared
- ✅ Consistent behavior across all features

## Files Modified

### New Files:
1. `/src/utils/authHandler.js` - Global authentication handler
2. `/src/utils/axiosConfig.js` - Axios interceptor configuration
3. `AUTH_TOKEN_FIX.md` - This documentation

### Modified Files:
1. `/src/contexts/NotificationContext.jsx` - Added 401 handling
2. `/src/contexts/ProfileContext.jsx` - Added 401 handling
3. `/src/app/components/PaymentButton.jsx` - Uses global handler
4. `/src/app/components/PaymentVerifier.jsx` - Uses global handler
5. `/src/app/signin/page.jsx` - Shows expiration messages

## Usage Guide

### For New API Calls:

#### Option 1: Use the authenticated fetch wrapper
```javascript
import { authenticatedFetch } from '@/utils/authHandler';

const fetchData = async () => {
  try {
    const response = await authenticatedFetch('/api/v1/endpoint', {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // 401 errors are automatically handled
    console.error('Error:', error);
  }
};
```

#### Option 2: Manual 401 handling with regular fetch
```javascript
import { handle401Error } from '@/utils/authHandler';

const fetchData = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/v1/endpoint', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // Check for 401 and handle it
  if (response.status === 401) {
    handle401Error(response);
    return;
  }
  
  return await response.json();
};
```

#### Option 3: Use the configured axios client
```javascript
import apiClient from '@/utils/axiosConfig';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/api/v1/endpoint');
    return response.data;
  } catch (error) {
    // 401 errors are automatically intercepted and handled
    console.error('Error:', error);
  }
};
```

## Testing Recommendations

### Manual Testing:

1. **Test Normal Flow:**
   - Log in as a user
   - Wait for 5+ minutes (until token expires)
   - Try to perform any action (like favoriting a property)
   - Verify immediate redirect to sign-in with message

2. **Test Notification Polling:**
   - Log in and stay on dashboard
   - Wait for 5+ minutes
   - Check browser console for 401 detection
   - Verify automatic redirect

3. **Test Payment Flow:**
   - Log in and initiate payment
   - Wait for token to expire during payment
   - Verify proper 401 handling

### Automated Testing (Future):

Consider adding tests for:
- `clearAllUserData()` function
- `handle401Error()` detection
- `authenticatedFetch()` wrapper
- Context 401 handling
- Sign-in message display

## Backend Recommendations

While this fix handles token expiration gracefully on the frontend, consider these backend improvements:

### 1. Increase Token Lifetime
```python
# Django settings.py example
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),  # Instead of 4 minutes
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

### 2. Implement Token Refresh
- Use refresh tokens to get new access tokens before expiration
- Reduces user disruption
- Better user experience for long sessions

### 3. Add Token Expiration to Response
- Include token expiration time in login response
- Frontend can track and proactively refresh
- Prevents unexpected session terminations

## Future Enhancements

1. **Automatic Token Refresh:**
   - Implement refresh token mechanism
   - Automatically refresh before expiration
   - Seamless experience for users

2. **Session Activity Tracking:**
   - Extend session on user activity
   - Auto-logout only after true inactivity
   - Better for user productivity

3. **Graceful Degradation:**
   - Save user's current work before redirect
   - Restore state after re-login
   - Minimize data loss

4. **Better User Feedback:**
   - Show countdown before expiration
   - Prompt to extend session
   - More control for users

## Notes

- The `isHandlingExpiration` flag prevents multiple simultaneous redirects if multiple 401s occur
- `sessionStorage` is used for expiration messages to ensure they only show once
- All token clearing is centralized to prevent inconsistencies
- The solution is backward compatible with existing code

## Support

For questions or issues related to this fix, check:
- This documentation
- `/src/utils/authHandler.js` source code
- Console logs (search for "Session expired")

