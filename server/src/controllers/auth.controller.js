const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/token');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }

    clearRefreshTokenCookie(res);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw ApiError.unauthorized('No refresh token');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      clearRefreshTokenCookie(res);
      return next(ApiError.unauthorized('Refresh token expired'));
    }
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(phone && { phone }), ...(avatar && { avatar }) },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, refresh, getMe, updateProfile };
