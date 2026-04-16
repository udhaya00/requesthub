import api from "./axios";

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data.data;
};

export const signupUser = async (payload) => {
  const response = await api.post("/auth/signup", payload);
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.data.user;
};

