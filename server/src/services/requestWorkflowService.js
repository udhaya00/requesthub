import { REQUEST_STATUS, STATUS_TRANSITIONS } from "../constants/requestConfig.js";
import { ApiError } from "../utils/apiError.js";

export const buildHistoryEntry = ({ status, comment, user }) => ({
  status,
  comment: comment || `Status updated to ${status}`,
  changedBy: user._id,
  changedByName: user.name || user.username,
  changedAt: new Date(),
});

export const assertRequestAccess = (request, user) => {
  const isOwner = request.userId.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have access to this request");
  }
};

export const assertCanEditRequest = (request) => {
  if (request.status !== REQUEST_STATUS.SUBMITTED) {
    throw new ApiError(400, "Only requests in Submitted status can be edited");
  }
};

export const assertValidTransition = (currentStatus, nextStatus) => {
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];

  if (!allowedTransitions.includes(nextStatus)) {
    throw new ApiError(
      400,
      `Invalid status transition from ${currentStatus} to ${nextStatus}`
    );
  }
};

export const addCommentEntry = (request, comment, user) => {
  request.history.push(
    buildHistoryEntry({
      status: request.status,
      comment,
      user,
    })
  );
};
