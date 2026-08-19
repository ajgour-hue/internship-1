import conversationModel from "../model/conversation.model.js";
import messageModel from "../model/message.model.js";
import { getIO } from "../socket/socket.js";
import {
    createNotification
} from "../utils/notification.util.js";


export const sendMessage = async (req, res) => {

    try {

        const {
            conversationId,
            text
        } = req.body;


        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Message cannot be empty"
            });
        }


        const conversation =
            await conversationModel.findById(
                conversationId
            );


        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }


        const userId =
            req.user._id.toString();


        const isParticipant =
            conversation.participants.some(
                (participant) =>
                    participant.toString() === userId
            );


        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not part of this conversation"
            });
        }


        const message =
            await messageModel.create({

                conversation:
                    conversationId,

                sender:
                    req.user._id,

                text: text.trim()
            });


        conversation.lastMessage =
            text.trim();

        conversation.lastMessageAt =
            new Date();


        await conversation.save();


        const populatedMessage =
            await messageModel
                .findById(message._id)
                .populate(
                    "sender",
                    "fullname profileImage"
                );

                const receiverId =
    conversation.participants.find(
        participant =>
            participant.toString() !==
            req.user._id.toString()
    );

await createNotification({
    recipient: receiverId,
    sender: req.user._id,

    type: "new_message",

    title: "New Message",

    message:
        `${req.user.fullname} sent you a message.`,

    conversation: conversationId
});



                const io = getIO();

io.to(
    `conversation:${conversationId}`
).emit(
    "new_message",
    populatedMessage
);


        return res.status(201).json({
            success: true,
            message:
                populatedMessage
        });


    } catch (error) {

        console.error(
            "Send message error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};  

export const getMessages = async (req, res) => {

    try {

        const conversationId =
            req.params.conversationId;


        const conversation =
            await conversationModel.findById(
                conversationId
            );


        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }


        const userId =
            req.user._id.toString();


        const isParticipant =
            conversation.participants.some(
                (participant) =>
                    participant.toString() === userId
            );


        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not part of this conversation"
            });
        }


        const messages =
            await messageModel
                .find({
                    conversation:
                        conversationId
                })
                .populate(
                    "sender",
                    "fullname profileImage"
                )
                .sort({
                    createdAt: 1
                });


        return res.status(200).json({
            success: true,
            messages
        });


    } catch (error) {

        console.error(
            "Get messages error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}; 