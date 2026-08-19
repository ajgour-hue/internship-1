import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../service/notification.api.js";


export const useNotification = () => {

    // Get all notifications
    const handleGetNotifications = async () => {
        return await getNotifications();
    };


    // Get unread count
    const handleGetUnreadCount = async () => {
        return await getUnreadCount();
    };


    // Mark single notification as read
    const handleMarkNotificationAsRead = async (
        notificationId
    ) => {

        const response =
            await markNotificationAsRead(
                notificationId
            );

        // Tell Navbar to refresh unread count
        window.dispatchEvent(
            new Event("notifications-updated")
        );

        return response;
    };


    // Mark all notifications as read
    const handleMarkAllNotificationsAsRead =
        async () => {

            const response =
                await markAllNotificationsAsRead();

            // Tell Navbar to refresh unread count
            window.dispatchEvent(
                new Event("notifications-updated")
            );

            return response;
        };


    return {
        handleGetNotifications,
        handleGetUnreadCount,
        handleMarkNotificationAsRead,
        handleMarkAllNotificationsAsRead,
    };
};