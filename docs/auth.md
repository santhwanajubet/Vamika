# Authentication Module

## Overview
Handles user registration, login, logout, token refresh, and profile management.

## Backend
- **Model:** `User` — name, email, password (bcrypt), role, refreshToken
- **Controller:** `auth.controller.js` — register, login, logout, refresh, getMe, updateProfile
- **Middleware:** `auth.js` — JWT verification (`protect`) and admin role guard (`admin`)
- **Validators:** `auth.validator.js` — express-validator rules for register/login/profile

### Security
- Passwords hashed with bcrypt (cost factor 12)
- Access tokens: 15-minute JWT in `Authorization: Bearer` header
- Refresh tokens: 7-day httpOnly cookie sent on `/api/auth/*` path
- Rate limiting: 5 requests/minute on auth endpoints

## Frontend
- **Pages:** `LoginPage.jsx`, `RegisterPage.jsx`
- **Slice:** `authSlice.js` — login, register, fetchMe, logout, updateProfile async thunks
- **API:** `authApi.js` — Axios calls to backend
- **Axios interceptor** auto-refreshes tokens on 401

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| POST | /api/auth/logout | — | Logout, clear cookie |
| POST | /api/auth/refresh | — | Refresh access token |
| GET | /api/auth/me | Customer | Get current user |
| PUT | /api/auth/profile | Customer | Update name/phone/avatar |
