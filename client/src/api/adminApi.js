import api from "./axios";

export const fetchDashboardStats = async () => {
  const response = await api.get("/admin/dashboard/stats");
  return response.data.data;
};

