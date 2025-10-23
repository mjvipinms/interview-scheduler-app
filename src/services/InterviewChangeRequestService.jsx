import axiosInstance from "../api/axios";

export const createChangeRequest = async (payload) => {
    const res = await axiosInstance.post(`/interviews/change-request`, payload);
    return res.data;
};

export const getPendingChangeRequest = async () => {
    const res = await axiosInstance.get(`/interviews/change-request/pending`);
    return res.data;
};

export const bulkUpdateChangeRequest = async (selected) => {
    const res = await axiosInstance.put(`/interviews/change-request/bulk-approve`, selected);
    return res.data;
};

export const fetchChangeRequestByPanelId = async (panelId) => {
  const response = await axiosInstance.get(`/interviews/panel/change-request/${panelId}`);
  return response.data;
};