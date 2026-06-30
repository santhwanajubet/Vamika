# Orders Module

## Overview
Order placement, history, detail view, cancellation, and admin order management with status transitions.

## Backend
- **Model:** `Order` — user, orderNumber (auto-generated `LS-YYYYMMDD-XXXX`), items, shippingAddress, payment details, subtotal/discount/shipping/tax/total, statusHistory array, trackingNumber
- **Controller:** `order.controller.js`

### Status Flow
```
Confirmed → Processing → Shipped → Delivered
    ↓            ↓
 Cancelled    Cancelled
```

### Business Logic
- Order placement: reads from user's cart, validates stock for each variant, decrements stock via `bulkWrite`, increments `soldCount`, clears cart
- Coupon application: validates and applies discount, increments usage counter
- Free shipping on orders $50+
- Cancellation: restores stock and soldCount

## Frontend
- **Pages:** `OrdersPage.jsx` (list), `OrderDetailPage.jsx` (detail with timeline)
- **Page:** `CheckoutPage.jsx` — shipping address form, order summary, place order
- **API:** `orderApi.js`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/orders | Customer | Place order |
| GET | /api/orders/my-orders | Customer | User's order history |
| GET | /api/orders/:id | Customer | Order detail |
| POST | /api/orders/:id/cancel | Customer | Cancel order |
| GET | /api/orders | Admin | All orders (filterable) |
| PUT | /api/orders/:id/status | Admin | Update status |
