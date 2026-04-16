import express from "express";
import { body, query } from "express-validator";

import {
  addRequestComment,
  analyzeRequestPrompt,
  createRequest,
  getRequestById,
  getRequestMetadata,
  getRequests,
  updateRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";
import {
  PRIORITIES,
  REQUEST_STATUS_VALUES,
  REQUEST_TYPES,
} from "../constants/requestConfig.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  [
    query("type").optional({ values: "falsy" }).isIn(REQUEST_TYPES),
    query("status").optional({ values: "falsy" }).isIn(REQUEST_STATUS_VALUES),
    query("priority").optional({ values: "falsy" }).isIn(PRIORITIES),
    query("startDate")
      .optional({ values: "falsy" })
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    query("endDate")
      .optional({ values: "falsy" })
      .isISO8601()
      .withMessage("End date must be a valid date"),
    validateRequest,
  ],
  getRequests
);
router.get("/meta", getRequestMetadata);
router.get("/:id", getRequestById);

router.post(
  "/analyze",
  [
    body("prompt")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Prompt must be between 10 and 2000 characters"),
    validateRequest,
  ],
  analyzeRequestPrompt
);

router.post(
  "/",
  [
    body("requestType").isIn(REQUEST_TYPES),
    body("shortDescription")
      .trim()
      .isLength({ min: 8, max: 140 })
      .withMessage("Short description must be between 8 and 140 characters"),
    body("justification")
      .trim()
      .isLength({ min: 15, max: 1000 })
      .withMessage("Justification must be between 15 and 1000 characters"),
    body("priority").isIn(PRIORITIES),
    body("suggestedAction")
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Suggested action must be between 10 and 500 characters"),
    body("targetResolutionDate")
      .isISO8601()
      .withMessage("Target resolution date must be a valid date"),
    validateRequest,
  ],
  createRequest
);

router.put(
  "/:id",
  [
    body("requestType").optional().isIn(REQUEST_TYPES),
    body("shortDescription").optional().trim().isLength({ min: 8, max: 140 }),
    body("justification").optional().trim().isLength({ min: 15, max: 1000 }),
    body("priority").optional().isIn(PRIORITIES),
    body("suggestedAction").optional().trim().isLength({ min: 10, max: 500 }),
    body("targetResolutionDate").optional().isISO8601(),
    validateRequest,
  ],
  updateRequest
);

router.patch(
  "/:id/status",
  authorize("admin"),
  [
    body("status").isIn(REQUEST_STATUS_VALUES),
    body("comment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Comment can be at most 500 characters"),
    validateRequest,
  ],
  updateRequestStatus
);

router.post(
  "/:id/comments",
  authorize("admin"),
  [
    body("comment")
      .trim()
      .isLength({ min: 3, max: 500 })
      .withMessage("Comment must be between 3 and 500 characters"),
    validateRequest,
  ],
  addRequestComment
);

export default router;
