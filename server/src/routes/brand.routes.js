const { Router } = require('express');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', getBrands);
router.post('/', protect, admin, createBrand);
router.put('/:id', protect, admin, updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

module.exports = router;
