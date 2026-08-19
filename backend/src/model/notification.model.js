import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        type: {
            type: String,
            enum: [
                "swap_request",
                "swap_accepted",
                "swap_rejected",
                "swap_cancelled",
                "swap_confirmed",
                "swap_completed",
                "new_message"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        swapRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SwapRequest",
            default: null
        },

        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

const notificationModel = mongoose.model(
    "Notification",
    notificationSchema
);

export default notificationModel;