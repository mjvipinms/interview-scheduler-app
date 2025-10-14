import axiosInstance from "./axios";

export const fetchRoles = async () => {
  const res = await axiosInstance.get("/roles");
  return res.data;
};