export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const REQUEST_TYPES = [
  "System Access Request",
  "Equipment Request",
  "Facility Request",
  "General Service Request",
];

export const PRIORITIES = ["urgent", "high", "normal"];

export const REQUEST_STATUS = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FULFILLED: "Fulfilled",
  CLOSED: "Closed",
};

export const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUS);

export const REQUEST_TYPE_KEYWORDS = {
  "System Access Request": [
    "access",
    "login",
    "permission",
    "vpn",
    "system",
    "portal",
    "credentials",
    "account",
    "application",
    "software",
  ],
  "Equipment Request": [
    "laptop",
    "monitor",
    "keyboard",
    "mouse",
    "device",
    "equipment",
    "headset",
    "printer",
    "hardware",
    "docking",
  ],
  "Facility Request": [
    "room",
    "facility",
    "building",
    "seat",
    "workspace",
    "maintenance",
    "repair",
    "cleaning",
    "office",
    "parking",
  ],
  "General Service Request": [
    "service",
    "support",
    "help",
    "issue",
    "request",
    "general",
  ],
};

export const PRIORITY_KEYWORDS = {
  urgent: ["urgent", "immediately", "critical", "asap", "today", "blocked"],
  high: ["high", "soon", "important", "priority", "tomorrow"],
};

export const STATUS_TRANSITIONS = {
  [REQUEST_STATUS.SUBMITTED]: [
    REQUEST_STATUS.UNDER_REVIEW,
    REQUEST_STATUS.APPROVED,
    REQUEST_STATUS.REJECTED,
  ],
  [REQUEST_STATUS.UNDER_REVIEW]: [
    REQUEST_STATUS.APPROVED,
    REQUEST_STATUS.REJECTED,
  ],
  [REQUEST_STATUS.APPROVED]: [REQUEST_STATUS.FULFILLED],
  [REQUEST_STATUS.REJECTED]: [],
  [REQUEST_STATUS.FULFILLED]: [REQUEST_STATUS.CLOSED],
  [REQUEST_STATUS.CLOSED]: [],
};

