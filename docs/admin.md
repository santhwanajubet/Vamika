# Admin Module

## Overview
Admin dashboard with analytics overview, product management, order management, and coupon management.

## Backend
- **Controllers:** `analytics.controller.js`, `user.controller.js`
- **Middleware guard:** `protect` + `admin` (checks `req.user.role === 'admin'`)

### Analytics Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/analytics/summary | Revenue, orders, users, product counts |
| GET | /api/analytics/revenue-over-time | Daily revenue for last N days (default 30) |
| GET | /api/analytics/top-products | Top 10 by soldCount |
| GET | /api/analytics/orders-by-status | Order count grouped by status |
| GET | /api/analytics/low-stock | Products with variants below threshold (default 5) |

### User Management (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user |
| PUT | /api/users/:id/role | Change role |
| DELETE | /api/users/:id | Delete user (cannot delete self) |

## Frontend
- **Layout:** Admin sidebar with Dashboard, Products, Orders, Coupons links
- **Dashboard:** `AdminDashboard.jsx` — stat cards (revenue, orders, users, products)
- **Products:** `AdminProducts.jsx` — table with archive button
- **Orders:** `AdminOrders.jsx` — table with status transition buttons
- **Coupons:** `AdminCoupons.jsx` — table + inline creation form + delete
