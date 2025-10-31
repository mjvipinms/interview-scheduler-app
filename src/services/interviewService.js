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
    return res.data;
  } catch (error) {
    console.error("Interview creation failed:", error);
    throw error;
  }
};

export const updateInterview = async (interviewId,interview) => {
  const response = await axiosInstance.put(`/interviews/${interviewId}`, interview);
  return response.data;
};

export const fetchAllInterviews = async () => {
  const response = await axiosInstance.get("/interviews");
  return response.data;
};

export const fetchAllInterviewsByPanelId = async (panelId) => {
  const response = await axiosInstance.get(`/interviews/panel/${panelId}`);
  return response.data;
};

export const fetchAllInterviewsByCandidateId = async (candidateId) => {
  const response = await axiosInstance.get(`/interviews/candidate/${candidateId}`);
  return response.data;
};

export const cancelInterview = async (interviewId) => {
  const response = await axiosInstance.delete(`/interviews/${interviewId}`);
  return response.data;
};

export const rescheduleInterview = async (interviewId, payload) => {
  const response = await axiosInstance.put(`/interviews/reschedule/${interviewId}`, payload);
  return response.data;
}