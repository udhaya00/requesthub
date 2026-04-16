import {
  PRIORITY_KEYWORDS,
  REQUEST_TYPE_KEYWORDS,
} from "../constants/requestConfig.js";

const suggestedActions = {
  "System Access Request":
    "Route to access management for approval, entitlement review, and provisioning.",
  "Equipment Request":
    "Route to workplace technology for stock validation, approval, and delivery scheduling.",
  "Facility Request":
    "Route to facilities operations for space review, scheduling, and on-site fulfillment.",
  "General Service Request":
    "Route to the shared services desk for triage, ownership assignment, and action planning.",
};

const resolutionOffsets = {
  urgent: 1,
  high: 3,
  normal: 5,
};

const normalizePrompt = (prompt) => prompt.replace(/\s+/g, " ").trim();

const toTitleCase = (value) =>
  value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildShortDescription = (prompt) => {
  const compactPrompt = normalizePrompt(prompt);
  const baseText = compactPrompt.replace(/[.!?]+$/, "");
  return toTitleCase(baseText.slice(0, 110)).slice(0, 110);
};

const detectRequestType = (normalizedPrompt) => {
  let bestType = "General Service Request";
  let highestScore = 0;

  Object.entries(REQUEST_TYPE_KEYWORDS).forEach(([requestType, keywords]) => {
    const score = keywords.reduce(
      (count, keyword) => count + Number(normalizedPrompt.includes(keyword)),
      0
    );

    if (score > highestScore) {
      highestScore = score;
      bestType = requestType;
    }
  });

  return bestType;
};

const detectPriority = (normalizedPrompt) => {
  if (PRIORITY_KEYWORDS.urgent.some((keyword) => normalizedPrompt.includes(keyword))) {
    return "urgent";
  }

  if (PRIORITY_KEYWORDS.high.some((keyword) => normalizedPrompt.includes(keyword))) {
    return "high";
  }

  return "normal";
};

const buildTargetDate = (priority) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + resolutionOffsets[priority]);
  targetDate.setHours(18, 0, 0, 0);
  return targetDate.toISOString();
};

export const analyzePrompt = (prompt) => {
  const normalizedPrompt = normalizePrompt(prompt).toLowerCase();
  const requestType = detectRequestType(normalizedPrompt);
  const priority = detectPriority(normalizedPrompt);
  const shortDescription = buildShortDescription(prompt);
  const justification = `Business need captured from requester: ${normalizePrompt(
    prompt
  )}. This request should be prioritized as ${priority} based on the stated impact and urgency.`;
  const suggestedAction = suggestedActions[requestType];

  return {
    requestType,
    priority,
    shortDescription,
    justification,
    suggestedAction,
    targetResolutionDate: buildTargetDate(priority),
  };
};

