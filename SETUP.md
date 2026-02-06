# JWT Authentication Setup Guide

This is a complete JWT-based authentication system with Google and Telegram login support.

## Environment Variables

Add these environment variables to your Vercel project in the **Settings > Environment Variables** section:

### Required Public Variables (Client-side):
- **NEXT_PUBLIC_GOOGLE_CLIENT_ID**: Your Google OAuth 2.0 Client ID
- **NEXT_PUBLIC_TELEGRAM_BOT_USERNAME**: Your Telegram Bot username

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Web application"
6. Add authorized redirect URIs (include both localhost and production URLs):
   - `http://localhost:3000`
   - `https://yourdomain.com`
7. Copy the **Client ID** and add it as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### 2. Telegram Bot Setup

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to create a new bot
4. Copy your **bot username** and add it as `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
5. Send `/setdomain` to set up the domain for Telegram Login Widget
6. Enter your domain (e.g., `yourdomain.com` or `localhost:3000`)

### 3. Backend Configuration

Update the backend URL in `/lib/apiClient.ts` if needed:
```typescript
const BASE_URL = 'https://auth.enwis.uz'; // Change if your backend is on a different URL
```

## File Structure

```
├── app/
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Home page (redirects to login/dashboard)
│   ├── login/
│   │   └── page.tsx         # Login page with Google & Telegram buttons
│   └── dashboard/
│       └── page.tsx         # Protected dashboard (requires authentication)
├── lib/
│   ├── apiClient.ts         # API client with token refresh logic
│   └── AuthContext.tsx      # Auth context and useAuth hook
├── components/
│   ├── GoogleLoginButton.tsx # Google login component
│   └── TelegramLoginButton.tsx # Telegram login component
```

## How It Works

### Authentication Flow

1. **Login**: User clicks Google or Telegram login button
2. **Provider Response**: Provider returns credentials
3. **Backend Exchange**: Frontend sends credentials to backend
4. **Token Storage**: 
   - Access token → Session Storage (cleared on browser close)
   - Refresh token → Local Storage (persistent across sessions)
5. **Auto Redirect**: User redirected to dashboard on success

### Token Refresh

- When API returns 401, the client automatically:
  1. Calls `/auth/refresh` endpoint with refresh token
  2. Updates access token in session storage
  3. Retries the original request
  4. Queues requests while refresh is in progress

### Protected Pages

Protected pages use the `useAuth()` hook to check `isAuthenticated` and redirect to login if needed.

## API Endpoints

Backend must implement these endpoints:

### POST /auth/google
**Request:**
```json
{
  "id_token": "string"
}
```
**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### POST /auth/telegram
**Request:**
```json
{
  "id": "number",
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "photo_url": "string",
  "auth_date": "number",
  "hash": "string"
}
```
**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "username": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### POST /auth/refresh
**Request:**
```json
{
  "refresh_token": "string"
}
```
**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

## Usage in Components

### Using useAuth Hook

```tsx
'use client';

import { useAuth } from '@/lib/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using API Client

```tsx
import { apiClient } from '@/lib/apiClient';

// API calls automatically include Authorization header
const response = await apiClient.getClient().get('/api/protected-endpoint');
```

## Security Features

✅ **Access token in memory** - Never persisted to disk (cleared on refresh)
✅ **Refresh token in localStorage** - Can be cleared on explicit logout
✅ **Automatic token refresh** - Seamless experience with expired tokens
✅ **Request queuing** - Multiple requests wait for token refresh
✅ **CORS handling** - Properly configured for cross-origin requests
✅ **XSS protection** - No sensitive tokens in localStorage alone

## Troubleshooting

### Google Login Not Working
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- Check that your domain is in Google Cloud Console's authorized origins
- Check browser console for errors

### Telegram Login Not Working
- Verify `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` is set correctly
- Ensure your domain is set in BotFather
- Check that Telegram script loads (no CSP issues)

### Token Not Refreshing
- Verify `/auth/refresh` endpoint is working
- Check that refresh token is stored in localStorage
- Check browser console for CORS errors

## Testing

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Login" and select your preferred provider
4. You should be redirected to the dashboard
5. Logout clears all tokens and redirects to login

## Production Deployment

1. Add your production domain to Google OAuth configuration
2. Set your production domain in Telegram BotFather
3. Update environment variables in Vercel project settings
4. Deploy to Vercel: `vercel deploy`
