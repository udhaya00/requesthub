import express from "express";
import { body } from "express-validator";

import { chatWithAssistant } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    body("message")
      .trim()
      .isLength({ min: 2, max: 1000 })
      .withMessage("Message must be between 2 and 1000 characters"),
    validateRequest,
  ],
  chatWithAssistant
);

export default router;

