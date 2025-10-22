import axiosInstance from "../api/axios";

export const getHrDashboardSummary = async () => {
  const response = await axiosInstance.get("/dashboard/hr-summary");
  return response.data;
};

export const getPanelDashboardSummary = async (panelId) => {
  const response = await axiosInstance.get(`/dashboard/panel-summary/${panelId}`);
  return response.data;
};

export const getAdminSummary = async () => {
  const response = await axiosInstance.get("/dashboard/admin-summary");
  return response.data;
};