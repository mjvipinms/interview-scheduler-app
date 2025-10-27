import { useEffect, useState } from "react";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId"); // assuming stored on login

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    const fetchNotifications = async (pageNum) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8083/api/notifications/get-by-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, page: pageNum, size }),
            });

            if (!response.ok) throw new Error("Failed to fetch notifications");

            const data = await response.json();
            setNotifications(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch("http://localhost:8083/api/notifications/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notificationId: id,
                    isRead: true,
                    updatedBy: userId,
                }),
            });

            if (response.ok) {
                // Refresh the list
                fetchNotifications(page);
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    if (loading) {
        return <div className="p-6 text-gray-600">Loading notifications...</div>;
    }

    if (notifications.length === 0) {
        return <div className="p-6 text-gray-600">No notifications found.</div>;
    }

    return (
        <Navbar>
            <DashboardContainer>
                <div className="p-6">
                    <h1 className="text-xl font-semibold mb-4">Notifications</h1>
                    <div className="flex flex-col gap-3">
                        {notifications.map((n) => (
                            <div
                                key={n.notificationId}
                                className={`border p-4 rounded-lg shadow-sm ${n.isRead ? "bg-gray-100" : "bg-blue-50"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="font-semibold">{n.subject}</h2>
                                        <p className="text-sm text-gray-700">{n.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Sent at: {new Date(n.sentAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {!n.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(n.notificationId)}
                                            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-sm">
                            Page {page + 1} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </DashboardContainer>
        </Navbar>
    );
}
