const { Router } = require('express');
const {
  register,
  login,
  logout,
  refresh,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  registerRules,
  loginRules,
  updateProfileRules,
} = require('../validators/auth.validator');

const router = Router();

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileRules), updateProfile);

module.exports = router;
