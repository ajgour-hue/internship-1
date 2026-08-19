import notificationModel from "../model/notification.model.js";


export const getNotifications = async (req, res) => {

    try {

        const notifications =
            await notificationModel
                .find({
                    recipient: req.user._id
                })
                .populate(
                    "sender",
                    "fullname profileImage"
                )
                .sort({
                    createdAt: -1
                })
                .limit(50);

        return res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {

        console.error(
            "Get notifications error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getUnreadCount = async (req, res) => {

    try {

        const count =
            await notificationModel.countDocuments({
                recipient: req.user._id,
                isRead: false
            });

        return res.status(200).json({
            success: true,
            count
        });

    } catch (error) {

        console.error(
            "Get unread count error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const markNotificationAsRead = async (
    req,
    res
) => {

    try {

        const notification =
            await notificationModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                    recipient: req.user._id
                },
                {
                    isRead: true
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            notification
        });

    } catch (error) {

        console.error(
            "Mark notification error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const markAllNotificationsAsRead = async (
    req,
    res
) => {

    try {

        await notificationModel.updateMany(
            {
                recipient: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "All notifications marked as read"
        });

    } catch (error) {

        console.error(
            "Mark all notifications error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};