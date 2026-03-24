# Google OAuth Setup Guide

Google OAuth has been successfully integrated into your MLRIT Counseling Portal! Follow these steps to complete the setup:

## 🔧 Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: MLRIT Counseling Portal
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: MLRIT Portal
   - Authorized JavaScript origins:
     - `http://localhost:5174`
     - `http://localhost:5173`
     - `https://mlrit-counseling-portal.vercel.app` (if deployed)
   - Authorized redirect URIs:
     - `http://localhost:5174`
     - `http://localhost:5173`
     - `https://mlrit-counseling-portal.vercel.app` (if deployed)

7. Copy the **Client ID** and **Client Secret**

### 2. Update Environment Variables

#### Backend (.env)
Update `mlrit-counseling-portal/backend/.env`:
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
JWT_SECRET=generate_a_random_string_here
SESSION_SECRET=generate_another_random_string_here
```

#### Frontend (.env)
Update `mlrit-counseling-portal/frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

### 3. Restart Servers

After updating the environment variables, restart both servers:

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev -- --port 5174
```

## ✨ Features Added

### Frontend (Login & Signup Pages)
- Google OAuth button with "Sign in with Google" / "Sign up with Google"
- Automatic account creation for new users
- Seamless login for existing users
- Email validation (only @mlrit.ac.in emails allowed)
- JWT token storage for authenticated sessions

### Backend
- New endpoint: `POST /api/auth/google`
- Google OAuth authentication controller
- JWT token generation
- Student model updated with `googleId` field
- Email domain validation (@mlrit.ac.in only)

## 🔒 Security Features

- Only MLRIT college emails (@mlrit.ac.in) can sign up via Google
- JWT tokens for secure session management
- Google ID stored securely in database
- CORS configured for allowed origins

## 📝 How It Works

1. User clicks "Sign in with Google" button
2. Google OAuth popup appears
3. User selects their MLRIT email
4. Backend validates the email domain
5. If new user: Creates account automatically
6. If existing user: Logs them in
7. JWT token is generated and stored
8. User is redirected to dashboard

## 🧪 Testing

1. Navigate to `http://localhost:5174/login`
2. Click the "Sign in with Google" button
3. Select your @mlrit.ac.in email
4. You should be redirected to the dashboard

## 📦 Packages Installed

### Frontend
- `@react-oauth/google` - Google OAuth for React
- `jwt-decode` - Decode JWT tokens

### Backend
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `express-session` - Session management
- `jsonwebtoken` - JWT token generation

## 🚀 Next Steps

1. Get your Google OAuth credentials from Google Cloud Console
2. Update the .env files with actual credentials
3. Test the login/signup flow
4. Deploy to production with production URLs in OAuth settings

## ⚠️ Important Notes

- Keep your Client Secret secure and never commit it to version control
- The .env files are already in .gitignore
- For production, add your production URL to Google OAuth authorized origins
- JWT_SECRET and SESSION_SECRET should be long random strings

## 🆘 Troubleshooting

**Issue**: "Google login failed"
- Check if VITE_GOOGLE_CLIENT_ID is set correctly in frontend/.env
- Verify the Client ID matches the one from Google Cloud Console

**Issue**: "Please use your MLRIT college email"
- Google OAuth only accepts @mlrit.ac.in emails
- Make sure you're signing in with your college email

**Issue**: "Authentication failed"
- Check backend/.env has all required variables
- Verify backend server is running on port 8000
- Check browser console for detailed error messages
