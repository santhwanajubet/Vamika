const { Router } = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

const router = Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
