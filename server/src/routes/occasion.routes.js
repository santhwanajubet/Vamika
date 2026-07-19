const { Router } = require('express');
const { getOccasions, createOccasion, updateOccasion, deleteOccasion } = require('../controllers/occasion.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', getOccasions);
router.post('/', protect, admin, createOccasion);
router.put('/:id', protect, admin, updateOccasion);
router.delete('/:id', protect, admin, deleteOccasion);

module.exports = router;
