import axiosInstance from "../api/axios";


export const getNotificationsByUser = async (payload) => {
  try {
    const res = await axiosInstance.post(`/notifications/get-by-user`, payload);

    if (res.data?.accessStatus) {
      throw new Error(res.data.accessStatus);
    }

    return res.data;
  } catch (error) {
    console.error("Fetching notifications failed:", error);
    throw error;
  }
};

export const updateNotification = async (notificationId, userId) => {
  try {
    const payload = {
      notificationId: notificationId,
      isRead: true,
      userId: userId,
    };

    const res = await axiosInstance.put(`/notifications`, payload);
    return res.data; // returns NotificationResponseDto
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};