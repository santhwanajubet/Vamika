const { Router } = require('express');
const {
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
} = require('../controllers/category.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategory);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
