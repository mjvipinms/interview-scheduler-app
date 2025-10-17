import axiosInstance from "../api/axios";


export const fetchPanelists = async (slotId) => {
  const response = await axiosInstance.get(`/api/v1/panelists?slotId=${slotId}`);
  return response.data;
};

export const fetchCandidates = async () => {
  const response = await axiosInstance.get("/api/v1/candidates");
  return response.data;
};

export const scheduleInterview = async (payload) => {
  try {
    const res = await axiosInstance.post(`/interviews`, payload);
    if (res.data?.accessStatus) {
      throw new Error(res.data.accessStatus);
    }
  } catch (error) {
    console.error("Interview creation failed:", error);
    throw error;
  }
  return res.data;
};

export const fetchAllInterviews = async () => {
  const response = await axiosInstance.get("/interviews");
  return response.data;
};