import api from "../api/axios";

export const generateDietPlan = async (payload) => {
  const res = await api.post("/diet/generate", payload);
  return res.data;
};

export const getUserLabReports = async () => {
  const res = await api.get(`/reports/me`);
  return res.data;
};

export const getLatestDietPlan = async () => {
  const res = await api.get("/diet/latest");
  return res.data;
};
