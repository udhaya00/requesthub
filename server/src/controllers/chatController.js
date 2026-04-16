import Request from "../models/Request.js";
import { REQUEST_STATUS } from "../constants/requestConfig.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildFaqResponse = () =>
  [
    "I can help you create a request, explain the workflow, or check request statuses.",
    "Try asking things like:",
    '- "How do I submit an access request?"',
    '- "What does Fulfilled mean?"',
    '- "Check status for SRH-20260414-AB12"',
  ].join(" ");

export const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const normalized = message.toLowerCase();

  let response = buildFaqResponse();
  const suggestions = [
    "How do I create a system access request?",
    "What is the request workflow?",
    "How do I export my requests?",
  ];

  if (normalized.includes("status")) {
    const requestIdMatch = message.match(/SRH-\d{8}-[A-Z0-9]{4}/i);

    if (requestIdMatch) {
      const request = await Request.findOne({ requestId: requestIdMatch[0] });

      if (request) {
        const canView =
          req.user.role === "admin" ||
          request.userId.toString() === req.user._id.toString();

        response = canView
          ? `Request ${request.requestId} is currently ${request.status}. Target resolution date is ${new Date(
              request.targetResolutionDate
            ).toLocaleDateString("en-IN")}.`
          : "I found that request, but you do not have access to view it.";
      } else {
        response =
          "I could not find that request ID. Double-check the ID and try again.";
      }
    } else {
      const scopeFilter =
        req.user.role === "admin" ? {} : { userId: req.user._id };
      const totalOpen = await Request.countDocuments({
        ...scopeFilter,
        status: {
          $in: [
            REQUEST_STATUS.SUBMITTED,
            REQUEST_STATUS.UNDER_REVIEW,
            REQUEST_STATUS.APPROVED,
            REQUEST_STATUS.FULFILLED,
          ],
        },
      });

      response = `There are currently ${totalOpen} active requests in scope for your account. Share a request ID if you want a specific status.`;
    }
  } else if (
    normalized.includes("create") ||
    normalized.includes("submit") ||
    normalized.includes("new request")
  ) {
    response =
      "Open New Request, describe the need in plain language, let the AI draft the request, review the preview, then submit it. Submitted requests can still be edited until review starts.";
  } else if (
    normalized.includes("workflow") ||
    normalized.includes("approve") ||
    normalized.includes("review")
  ) {
    response =
      "The workflow is Submitted to Under Review to Approved or Rejected to Fulfilled to Closed. Only Submitted requests can be edited, and only Fulfilled requests can be closed.";
  } else if (
    normalized.includes("access") ||
    normalized.includes("equipment") ||
    normalized.includes("facility")
  ) {
    response =
      "Use detailed business context in your prompt. Mention the system or item you need, why it is needed, who is impacted, and the urgency so the AI can classify the request and draft a strong justification.";
  } else if (
    normalized.includes("export") ||
    normalized.includes("csv") ||
    normalized.includes("pdf")
  ) {
    response =
      "You can export filtered requests as CSV from My Requests. The PDF preview simulates a printable summary before sharing or saving.";
  }

  res.json({
    success: true,
    data: {
      response,
      suggestions,
    },
  });
});
