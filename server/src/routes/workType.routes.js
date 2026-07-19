const { Router } = require('express');
const { getWorkTypes, createWorkType, updateWorkType, deleteWorkType } = require('../controllers/workType.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', getWorkTypes);
router.post('/', protect, admin, createWorkType);
router.put('/:id', protect, admin, updateWorkType);
router.delete('/:id', protect, admin, deleteWorkType);

module.exports = router;
