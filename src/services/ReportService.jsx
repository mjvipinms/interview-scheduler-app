import axiosInstance from "../api/axios";

export const getHrReports = async ({
  type,
  startDate,
  endDate,
  page = 1,
  size = 25,
  sortField,
  sortDir = "asc",
}) => {
  const params = {
    type,
    page,
    size,
    sortDir,
  };

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (sortField) params.sortField = sortField;

  const response = await axiosInstance.get("/reports", { params });
  return response.data;
};