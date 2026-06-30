const { Router } = require('express');
const {
  getProductReviews, createReview, updateReview, deleteReview, getAllReviews, approveReview,
} = require('../controllers/review.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/', protect, admin, getAllReviews);
router.put('/:id/approve', protect, admin, approveReview);

module.exports = router;
