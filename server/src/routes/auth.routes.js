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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201:
 *         description: User registered
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Logged in
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout (clears cookie)
 *     responses:
 *       200:
 *         description: Logged out
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Token refreshed
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Current user data
 * /api/auth/profile:
 *   put:
 *     tags: [Auth]
 *     summary: Update profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileRules), updateProfile);

module.exports = router;
