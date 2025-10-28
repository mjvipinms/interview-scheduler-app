import React, { useEffect, useState } from "react";
import { getNotificationsByUser, updateNotification } from "../services/NotificationService";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNum, setPageNum] = useState(0);

  const loggedInUserId = localStorage.getItem("userId");

  const fetchNotifications = async (page = 0) => {
    setLoading(true);
    try {
      const payload = {
        userId: loggedInUserId,
        page,
        size: 10,
      };
      const data = await getNotificationsByUser(payload);
      setNotifications(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(pageNum);
  }, [pageNum]);

  const handleMarkAsRead = async (notificationId) => {
  try {
    await updateNotification(notificationId, loggedInUserId);

    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      )
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Notifications</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Recipient</th>
                <th className="px-6 py-3">Sent At</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Updated By</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n,index) => {
                const isUnread = n.isRead === false || n.isRead === null;

                return (
                  <tr
                    key={n.notificationId}
                    onClick={() => handleMarkAsRead(n.notificationId)}
                    className={`border-t cursor-pointer transition ${
                      isUnread
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-3 font-medium">{pageNum * 10 + (index + 1)}</td>
                    <td className="px-6 py-3 font-medium">{n.subject || "-"}</td>
                    <td className="px-6 py-3">{n.content || "-"}</td>
                    <td className="px-6 py-3">{n.recipient || "-"}</td>
                    <td className="px-6 py-3">
                      {n.sentAt ? new Date(n.sentAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-3">{n.createdBy || "-"}</td>
                    <td className="px-6 py-3">{n.updatedBy || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={pageNum === 0}
          onClick={() => setPageNum((prev) => prev - 1)}
          className={`px-4 py-2 rounded-md border ${
            pageNum === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {pageNum + 1} of {totalPages || 1}
        </span>

        <button
          disabled={pageNum + 1 >= totalPages}
          onClick={() => setPageNum((prev) => prev + 1)}
          className={`px-4 py-2 rounded-md border ${
            pageNum + 1 >= totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
