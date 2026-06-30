# Product Catalog Module

## Overview
Product listing, detail view, search, filtering, sorting, and admin CRUD.

## Backend
- **Model:** `Product` — name, slug, description, category, brand, images, price, comparePrice, variants (size/color/sku/stock), tags, gender, fabric, fit, pattern, featured, isNew, avgRating, numReviews, soldCount
- **Controller:** `product.controller.js`

### Features
- Full-text search via MongoDB `$text` index on name/description/tags
- Filtering by category, brand, gender, price range, size, color
- Sorting by newest, price (asc/desc), rating, popularity (soldCount)
- Paginated responses with page/limit/total/pages
- Virtual fields: `totalStock` (sum of variant stocks), `hasDiscount` (comparePrice > price)

## Frontend
- **Pages:** `ShopPage.jsx`, `ProductPage.jsx`
- **API:** `productApi.js`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/products | — | List (search, filter, sort, paginate) |
| GET | /api/products/featured | — | Featured products (max 8) |
| GET | /api/products/new-arrivals | — | New arrivals (max 8) |
| GET | /api/products/related/:id | — | Related by category (max 4) |
| GET | /api/products/:slug | — | Single product |
| POST | /api/products | Admin | Create |
| PUT | /api/products/:id | Admin | Update |
| DELETE | /api/products/:id | Admin | Archive (soft delete) |
