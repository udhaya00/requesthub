import Request from "../models/Request.js";
import { REQUEST_STATUS_VALUES } from "../constants/requestConfig.js";
import { analyzePrompt } from "../services/requestAiService.js";
import {
  addCommentEntry,
  assertCanEditRequest,
  assertRequestAccess,
  assertValidTransition,
  buildHistoryEntry,
} from "../services/requestWorkflowService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateRequestId } from "../utils/requestId.js";

const buildRequestFilters = (query) => {
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

  return filters;
};

export const analyzeRequestPrompt = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const analysis = analyzePrompt(prompt);

  res.json({
    success: true,
    message: "Prompt analyzed successfully",
    data: analysis,
  });
});

export const createRequest = asyncHandler(async (req, res) => {
  const {
    requestType,
    shortDescription,
    justification,
    priority,
    suggestedAction,
    targetResolutionDate,
    originalPrompt,
  } = req.body;

  const request = await Request.create({
    requestId: generateRequestId(),
    userId: req.user._id,
    requestType,
    shortDescription,
    justification,
    priority,
    suggestedAction,
    originalPrompt,
    targetResolutionDate,
    history: [
      buildHistoryEntry({
        status: "Submitted",
        comment: "Request submitted",
        user: req.user,
      }),
    ],
  });

  const populatedRequest = await Request.findById(request._id).populate(
    "userId",
    "name username email role"
  );

  res.status(201).json({
    success: true,
    message: "Request created successfully",
    data: populatedRequest,
  });
});

export const getRequests = asyncHandler(async (req, res) => {
  const filters = buildRequestFilters(req.query);

  if (req.user.role !== "admin") {
    filters.userId = req.user._id;
  }

  const requests = await Request.find(filters)
    .populate("userId", "name username email role")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests,
  });
});

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id).populate(
    "userId",
    "name username email role"
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  assertRequestAccess(request, req.user);

  res.json({
    success: true,
    data: request,
  });
});

export const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  assertRequestAccess(request, req.user);
  assertCanEditRequest(request);

  const editableFields = [
    "requestType",
    "shortDescription",
    "justification",
    "priority",
    "suggestedAction",
    "targetResolutionDate",
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      request[field] = req.body[field];
    }
  });

  request.history.push(
    buildHistoryEntry({
      status: request.status,
      comment: "Request details updated",
      user: req.user,
    })
  );

  await request.save();

  const populatedRequest = await Request.findById(request._id).populate(
    "userId",
    "name username email role"
  );

  res.json({
    success: true,
    message: "Request updated successfully",
    data: populatedRequest,
  });
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  assertValidTransition(request.status, status);

  request.status = status;
  request.history.push(
    buildHistoryEntry({
      status,
      comment,
      user: req.user,
    })
  );

  await request.save();

  const populatedRequest = await Request.findById(request._id).populate(
    "userId",
    "name username email role"
  );

  res.json({
    success: true,
    message: "Request status updated successfully",
    data: populatedRequest,
  });
});

export const addRequestComment = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  addCommentEntry(request, req.body.comment, req.user);
  await request.save();

  const populatedRequest = await Request.findById(request._id).populate(
    "userId",
    "name username email role"
  );

  res.json({
    success: true,
    message: "Comment added successfully",
    data: populatedRequest,
  });
});

export const getRequestMetadata = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      requestStatuses: REQUEST_STATUS_VALUES,
    },
  });
});

