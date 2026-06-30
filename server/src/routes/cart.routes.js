const { Router } = require('express');
const { getCart, addItem, updateItem, removeItem, clearCart, mergeCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

const router = Router();

router.get('/', protect, getCart);
router.post('/items', protect, addItem);
router.put('/items/:itemId', protect, updateItem);
router.delete('/items/:itemId', protect, removeItem);
router.delete('/', protect, clearCart);
router.post('/merge', protect, mergeCart);

module.exports = router;
