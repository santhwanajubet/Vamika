# Shopping Cart Module

## Overview
Cart management for authenticated users. Supports add, update, remove, clear, and guest cart merging.

## Backend
- **Model:** `Cart` — one cart per user (unique), items array with product ref, variantSku, quantity, price
- **Controller:** `cart.controller.js`

### Business Logic
- Stock validation on add/update
- Quantity enforcement (minimum 1, maximum = available stock)
- Guest cart merge: when a user logs in, anonymous items merge into their DB cart (quantities summed for matching SKUs)

## Frontend
- **Slice:** `cartSlice.js` — both async (logged-in) and local (guest) actions
- **Page:** `CartPage.jsx` — displays items, quantity controls, subtotal
- **API:** `cartApi.js`

### Guest Cart
- Actions: `addGuestItem`, `removeGuestItem`, `clearGuestCart` (local state only)
- Cart badge count in Navbar

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/cart | Customer | Get cart (populated) |
| POST | /api/cart/items | Customer | Add item (productId, variantSku, quantity) |
| PUT | /api/cart/items/:itemId | Customer | Update quantity |
| DELETE | /api/cart/items/:itemId | Customer | Remove item |
| DELETE | /api/cart | Customer | Clear cart |
| POST | /api/cart/merge | Customer | Merge guest cart |
