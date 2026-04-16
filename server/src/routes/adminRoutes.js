import express from "express";
import { body } from "express-validator";

import { getDashboardStats } from "../controllers/adminController.js";
import {
  addRequestComment,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { REQUEST_STATUS_VALUES } from "../constants/requestConfig.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard/stats", getDashboardStats);

router.patch(
  "/requests/:id/status",
  [
    body("status").isIn(REQUEST_STATUS_VALUES),
    body("comment").optional().trim().isLength({ max: 500 }),
    validateRequest,
  ],
  updateRequestStatus
);

router.post(
  "/requests/:id/comments",
  [
    body("comment").trim().isLength({ min: 3, max: 500 }),
    validateRequest,
  ],
  addRequestComment
);

export default router;

