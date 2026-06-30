const { Router } = require('express');
const { getSummary, getRevenueOverTime, getTopProducts, getOrdersByStatus, getLowStock } = require('../controllers/analytics.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/summary', protect, admin, getSummary);
router.get('/revenue-over-time', protect, admin, getRevenueOverTime);
router.get('/top-products', protect, admin, getTopProducts);
router.get('/orders-by-status', protect, admin, getOrdersByStatus);
router.get('/low-stock', protect, admin, getLowStock);

module.exports = router;
