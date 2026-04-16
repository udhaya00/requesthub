import api from "./axios";

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );

export const analyzePrompt = async (prompt) => {
  const response = await api.post("/requests/analyze", { prompt });
  return response.data.data;
};

export const createRequest = async (payload) => {
  const response = await api.post("/requests", payload);
  return response.data.data;
};

export const fetchRequests = async (filters = {}) => {
  const response = await api.get("/requests", {
    params: sanitizeParams(filters),
  });
  return response.data.data;
};

export const fetchRequestById = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data.data;
};

export const updateRequest = async (id, payload) => {
  const response = await api.put(`/requests/${id}`, payload);
  return response.data.data;
};

export const updateRequestStatus = async (id, payload) => {
  const response = await api.patch(`/requests/${id}/status`, payload);
  return response.data.data;
};

export const addRequestComment = async (id, payload) => {
  const response = await api.post(`/requests/${id}/comments`, payload);
  return response.data.data;
};

export const downloadRequestsCsv = async (filters = {}) => {
  const response = await api.get("/export/requests.csv", {
    params: sanitizeParams(filters),
    responseType: "blob",
  });

  return response.data;
};
