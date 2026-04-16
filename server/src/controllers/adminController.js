import Request from "../models/Request.js";
import { REQUEST_STATUS } from "../constants/requestConfig.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [total, pending, approved, fulfilled, recentRequests] = await Promise.all([
    Request.countDocuments(),
    Request.countDocuments({
      status: { $in: [REQUEST_STATUS.SUBMITTED, REQUEST_STATUS.UNDER_REVIEW] },
    }),
    Request.countDocuments({ status: REQUEST_STATUS.APPROVED }),
    Request.countDocuments({ status: REQUEST_STATUS.FULFILLED }),
    Request.find()
      .populate("userId", "name username")
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  res.json({
    success: true,
    data: {
      total,
      pending,
      approved,
      fulfilled,
      recentRequests,
    },
  });
});

