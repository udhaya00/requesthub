import { Parser } from "json2csv";

import Request from "../models/Request.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildFilters = (query, user) => {
  const filters = {};

  if (query.type) {
    filters.requestType = query.type;
  }
  if (query.status) {
    filters.status = query.status;
  }
  if (query.priority) {
    filters.priority = query.priority;
  }
  if (query.startDate || query.endDate) {
    filters.createdAt = {};
    if (query.startDate) {
      filters.createdAt.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filters.createdAt.$lte = endDate;
    }
  }

  if (user.role !== "admin") {
    filters.userId = user._id;
  }

  return filters;
};

export const exportRequestsCsv = asyncHandler(async (req, res) => {
  const filters = buildFilters(req.query, req.user);

  const requests = await Request.find(filters)
    .populate("userId", "name username email")
    .sort({ createdAt: -1 });

  const parser = new Parser({
    fields: [
      "requestId",
      "requestType",
      "shortDescription",
      "priority",
      "status",
      "targetResolutionDate",
      "createdAt",
      "requesterName",
      "requesterUsername",
      "justification",
      "suggestedAction",
    ],
  });

  const csv = parser.parse(
    requests.map((request) => ({
      requestId: request.requestId,
      requestType: request.requestType,
      shortDescription: request.shortDescription,
      priority: request.priority,
      status: request.status,
      targetResolutionDate: request.targetResolutionDate,
      createdAt: request.createdAt,
      requesterName: request.userId?.name || "Unknown",
      requesterUsername: request.userId?.username || "Unknown",
      justification: request.justification,
      suggestedAction: request.suggestedAction,
    }))
  );

  res.header("Content-Type", "text/csv");
  res.attachment("smart-request-hub-requests.csv");
  res.send(csv);
});

