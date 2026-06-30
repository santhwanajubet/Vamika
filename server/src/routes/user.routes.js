const { Router } = require('express');
const { getUsers, getUser, updateUserRole, deleteUser } = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUser);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
