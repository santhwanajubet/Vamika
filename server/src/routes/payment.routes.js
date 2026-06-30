const { Router, raw } = require('express');
const { createPaymentIntent, handleWebhook, refund } = require('../controllers/payment.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', raw({ type: 'application/json' }), handleWebhook);
router.post('/refund', protect, admin, refund);

module.exports = router;
