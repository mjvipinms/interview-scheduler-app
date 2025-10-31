import axiosInstance from "../api/axios";

export const fetchSlots = async () => {
  const response = await axiosInstance.get("/slots");
  return response.data;
};

export const createSlot = async (slot) => {
  const response = await axiosInstance.post('/slots' , slot);
  return response.data;
};
export const updateSlot = async (slotId,slot) => {
  const response = await axiosInstance.put(`/slots/${slotId}`, slot);
  return response.data;
};

export const deleteSlot = async (id) => {
  await axios.delete(`/slots/${id}`);
};

export const fetchSlotsByPanelId = async (panelId) => {
  const response = await axiosInstance.get(`/slots/panel/${panelId}`);
  return response.data;
};

export const fetchAvailableSlots = async () => {
  const response = await axiosInstance.get("/slots/available");
  return response.data;
};
