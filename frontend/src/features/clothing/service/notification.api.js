import axios from "axios";

const notificationApiInstance = axios.create({
    baseURL: `${
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:3000"
    }/api/notifications`,
    withCredentials: true,
});


// Get notifications
export async function getNotifications() {
    const response = await notificationApiInstance.get("/");

    return response.data;
}


// Get unread notification count
export async function getUnreadCount() {
    const response =
        await notificationApiInstance.get(
            "/unread-count"
        );

    return response.data;
}


// Mark single notification as read
export async function markNotificationAsRead(
    notificationId
) {
    const response =
        await notificationApiInstance.patch(
            `/${notificationId}/read`
        );

    return response.data;
}


// Mark all notifications as read
export async function markAllNotificationsAsRead() {
    const response =
        await notificationApiInstance.patch(
            "/read-all"
        );

    return response.data;
}