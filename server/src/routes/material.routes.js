const { Router } = require('express');
const { getMaterials, createMaterial, updateMaterial, deleteMaterial } = require('../controllers/material.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', getMaterials);
router.post('/', protect, admin, createMaterial);
router.put('/:id', protect, admin, updateMaterial);
router.delete('/:id', protect, admin, deleteMaterial);

module.exports = router;
