import { Router } from "express";

import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../controller/notification.controller.js";

import {
    authenticateUser
} from "../middleware/auth.middleware.js";

const router = Router();


router.get(
    "/",
    authenticateUser,
    getNotifications
);


router.get(
    "/unread-count",
    authenticateUser,
    getUnreadCount
);


router.patch(
    "/read-all",
    authenticateUser,
    markAllNotificationsAsRead
);


router.patch(
    "/:id/read",
    authenticateUser,
    markNotificationAsRead
);


export default router;