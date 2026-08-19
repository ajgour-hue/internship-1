import notificationModel from "../model/notification.model.js";
import { getIO } from "../socket/socket.js";


export const createNotification = async ({
    recipient,
    sender = null,
    type,
    title,
    message,
    swapRequest = null,
    conversation = null
}) => {

    const notification =
        await notificationModel.create({
            recipient,
            sender,
            type,
            title,
            message,
            swapRequest,
            conversation
        });


    const populatedNotification =
        await notificationModel
            .findById(notification._id)
            .populate(
                "sender",
                "fullname profileImage"
            );


    const io = getIO();


    io.to(
        `user:${recipient.toString()}`
    ).emit(
        "new_notification",
        populatedNotification
    );


    return populatedNotification;
};