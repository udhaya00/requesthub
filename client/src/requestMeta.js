export const REQUEST_TYPES = [
  "System Access Request",
  "Equipment Request",
  "Facility Request",
  "General Service Request",
];

export const REQUEST_STATUSES = [
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "Fulfilled",
  "Closed",
];

export const NEXT_STATUS_OPTIONS = {
  Submitted: ["Under Review", "Approved", "Rejected"],
  "Under Review": ["Approved", "Rejected"],
  Approved: ["Fulfilled"],
  Rejected: [],
  Fulfilled: ["Closed"],
  Closed: [],
};

