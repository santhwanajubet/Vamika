const { Router } = require('express');
const {
  createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
