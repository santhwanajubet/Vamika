const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (validations) => {
  return async (req, _res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((e) => e.msg);
      return next(ApiError.badRequest('Validation failed', messages));
    }

    next();
  };
};

module.exports = { validate };
