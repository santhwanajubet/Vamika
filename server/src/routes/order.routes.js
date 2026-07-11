const { Router } = require('express');
const {
  createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of orders
 * /api/orders/my-orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get my orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User's orders
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order data
 * /api/orders/{id}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Cancel order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
