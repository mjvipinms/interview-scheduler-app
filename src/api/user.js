import axiosInstance from "./axios";

export const getAllUsers = async (page = 0, size = 10) => {
  const res = await axiosInstance.get(`/users?page=${page}&size=${size}`);
  return res.data;
};
export const getUserById = async (id) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await axiosInstance.put(`/users/${id}`, userData);
  return res.data;
};

export const addUser = async (userData) => {
  const res = await axiosInstance.post(`/users`, userData);
  return res.data;
};

export const getUsersByRole = async (role = null, page = 0, size = 10) => {
  try {
    const res = await axiosInstance.get(`/users/role/${role}?page=${page}&size=${size}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const getAllUsersByRole = async (role) => {
  try {
    const res = await axiosInstance.get(`/users/all/role/${role}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAvailablePanelists = async (startTime, endTime) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get('/users/available/panelist', {
    params: { startTime, endTime }
  });
  return res.data;
};

export const getPendingPanelists = async () => {
  const res = await axiosInstance.get(`/users/panelists/pending`);
  return res.data;
};