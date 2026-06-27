const { verifyAccessToken } = require('../utils/token');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    next(error);
  }
};

const admin = (req, _res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(ApiError.forbidden('Admin access required'));
};

module.exports = { protect, admin };
