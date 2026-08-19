import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useNotification } from "../hook/useNotification.js";


const Notifications = () => {

    const navigate = useNavigate();

    const {
        handleGetNotifications,
        handleMarkNotificationAsRead,
        handleMarkAllNotificationsAsRead,
    } = useNotification();


    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);


    // Fetch notifications
    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const data =
                await handleGetNotifications();

            setNotifications(
                data?.notifications || []
            );

        } catch (error) {

            console.error(
                "Get notifications error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load notifications"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchNotifications();

    }, []);


    // Handle notification click
    const handleNotificationClick = async (
        notification
    ) => {

        try {

            if (!notification.isRead) {

                await handleMarkNotificationAsRead(
                    notification._id
                );

                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id
                            ? {
                                  ...item,
                                  isRead: true,
                              }
                            : item
                    )
                );
            }


            // Swap notification navigation
            if (
                notification.type ===
                    "swap_request" ||
                notification.type ===
                    "swap_confirmed"
            ) {

                navigate("/swaps/received");

                return;
            }


            if (
                notification.type ===
                    "swap_accepted" ||
                notification.type ===
                    "swap_rejected" ||
                notification.type ===
                    "swap_cancelled" ||
                notification.type ===
                    "swap_completed"
            ) {

                navigate("/swaps/sent");

                return;
            }


            // Message notification
            if (
                notification.type ===
                "new_message"
            ) {

                if (notification.conversation) {

                    navigate(
                        `/messages/${notification.conversation}`
                    );

                }

            }

        } catch (error) {

            console.error(
                "Notification click error:",
                error
            );

            toast.error(
                "Failed to open notification"
            );

        }
    };


    // Mark all as read
    const handleMarkAllAsRead = async () => {

        try {

            setMarkingAll(true);

            await handleMarkAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            toast.success(
                "All notifications marked as read"
            );

        } catch (error) {

            console.error(
                "Mark all notifications error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to mark notifications as read"
            );

        } finally {

            setMarkingAll(false);

        }
    };


    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;


    // Notification icon
    const getNotificationIcon = (
        type
    ) => {

        switch (type) {

            case "swap_request":
                return "ri-arrow-left-right-line";

            case "swap_accepted":
                return "ri-checkbox-circle-line";

            case "swap_rejected":
                return "ri-close-circle-line";

            case "swap_cancelled":
                return "ri-forbid-2-line";

            case "swap_confirmed":
                return "ri-shield-check-line";

            case "swap_completed":
                return "ri-check-double-line";

            case "new_message":
                return "ri-message-3-line";

            default:
                return "ri-notification-3-line";
        }
    };


    // Time formatting
    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        const notificationDate =
            new Date(date);

        const now = new Date();

        const difference =
            Math.floor(
                (now - notificationDate) /
                    1000
            );


        if (difference < 60) {
            return "Just now";
        }


        const minutes =
            Math.floor(
                difference / 60
            );

        if (minutes < 60) {
            return `${minutes}m ago`;
        }


        const hours =
            Math.floor(
                minutes / 60
            );

        if (hours < 24) {
            return `${hours}h ago`;
        }


        const days =
            Math.floor(
                hours / 24
            );

        if (days < 7) {
            return `${days}d ago`;
        }


        return notificationDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };


    return (

        <main className="min-h-screen bg-white">

            {/* Header */}

            <section className="px-6 md:px-10 lg:px-20 pt-10 pb-6">

                <div className="max-w-3xl mx-auto">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                                Activity
                            </p>

                            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-black">
                                Notifications
                            </h1>

                        </div>


                        {unreadCount > 0 && (

                            <button
                                type="button"
                                onClick={
                                    handleMarkAllAsRead
                                }
                                disabled={markingAll}
                                className="px-4 py-2.5 rounded-full border border-neutral-200 text-xs font-medium hover:bg-neutral-50 transition disabled:opacity-50"
                            >
                                {markingAll
                                    ? "Updating..."
                                    : "Mark all as read"}
                            </button>

                        )}

                    </div>


                    {unreadCount > 0 && (

                        <p className="mt-3 text-sm text-neutral-500">

                            {unreadCount} unread{" "}
                            {unreadCount === 1
                                ? "notification"
                                : "notifications"}

                        </p>

                    )}

                </div>

            </section>


            {/* Notifications */}

            <section className="px-6 md:px-10 lg:px-20 pb-16">

                <div className="max-w-3xl mx-auto">

                    {loading ? (

                        <div className="py-20 flex items-center justify-center">

                            <div className="flex items-center gap-3 text-sm text-neutral-500">

                                <span className="w-4 h-4 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />

                                Loading notifications...

                            </div>

                        </div>

                    ) : notifications.length === 0 ? (

                        <div className="py-20 text-center border border-neutral-200 rounded-2xl">

                            <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">

                                <i className="ri-notification-off-line text-2xl text-neutral-400" />

                            </div>


                            <h2 className="mt-5 text-lg font-medium text-black">
                                No notifications
                            </h2>


                            <p className="mt-2 text-sm text-neutral-500">
                                You're all caught up.
                            </p>

                        </div>

                    ) : (

                        <div className="border border-neutral-200 rounded-2xl overflow-hidden">

                            {notifications.map(
                                (
                                    notification,
                                    index
                                ) => (

                                <button
                                    key={
                                        notification._id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={`
                                        w-full text-left p-5 flex gap-4 transition
                                        ${
                                            !notification.isRead
                                                ? "bg-neutral-50"
                                                : "bg-white"
                                        }
                                        ${
                                            index !==
                                            notifications.length -
                                                1
                                                ? "border-b border-neutral-200"
                                                : ""
                                        }
                                        hover:bg-neutral-100
                                    `}
                                >

                                    {/* Icon */}

                                    <div
                                        className={`
                                            shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                                            ${
                                                notification.isRead
                                                    ? "bg-neutral-100 text-neutral-400"
                                                    : "bg-black text-white"
                                            }
                                        `}
                                    >

                                        <i
                                            className={`${getNotificationIcon(
                                                notification.type
                                            )} text-lg`}
                                        />

                                    </div>


                                    {/* Content */}

                                    <div className="flex-1 min-w-0">

                                        <div className="flex items-start justify-between gap-3">

                                            <h3
                                                className={`
                                                    text-sm
                                                    ${
                                                        notification.isRead
                                                            ? "font-medium text-neutral-700"
                                                            : "font-semibold text-black"
                                                    }
                                                `}
                                            >
                                                {notification.title}
                                            </h3>


                                            {!notification.isRead && (

                                                <span className="shrink-0 w-2 h-2 rounded-full bg-black mt-1.5" />

                                            )}

                                        </div>


                                        <p className="mt-1 text-sm text-neutral-500 leading-6">
                                            {notification.message}
                                        </p>


                                        <p className="mt-2 text-xs text-neutral-400">
                                            {formatTime(
                                                notification.createdAt
                                            )}
                                        </p>

                                    </div>


                                    {/* Arrow */}

                                    <div className="shrink-0 self-center text-neutral-300">

                                        <i className="ri-arrow-right-s-line text-lg" />

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>

            </section>

        </main>

    );
};


export default Notifications;