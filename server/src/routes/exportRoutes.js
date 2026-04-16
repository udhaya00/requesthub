import express from "express";

import { exportRequestsCsv } from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/requests.csv", protect, exportRequestsCsv);

export default router;

