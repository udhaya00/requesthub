import { validationResult } from "express-validator";

import { ApiError } from "../utils/apiError.js";

export const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(
    new ApiError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }))
    )
  );
};

