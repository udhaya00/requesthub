import api from "./axios";

export const sendChatMessage = async (message) => {
  const response = await api.post("/chat", { message });
  return response.data.data;
};

