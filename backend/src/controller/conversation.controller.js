import conversationModel from "../model/conversation.model.js";
import swapRequestModel from "../model/swapRequest.model.js";


export const createConversation = async (req, res) => {

    try {

        const { swapRequestId } = req.body;

        const swapRequest =
            await swapRequestModel.findById(
                swapRequestId
            );

        if (!swapRequest) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }


        // Chat only after swap is accepted
        if (
            swapRequest.status !== "accepted" &&
            swapRequest.status !== "confirmed" &&
            swapRequest.status !== "completed"
        ) {
            return res.status(400).json({
                message:
                    "Chat is available only after swap acceptance"
            });
        }


        const userId =
            req.user._id.toString();


        const isParticipant =
            swapRequest.requester.toString() === userId ||
            swapRequest.receiver.toString() === userId;


        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not part of this swap"
            });
        }


        // Check existing conversation
        let conversation =
            await conversationModel.findOne({
                swapRequest: swapRequestId
            });


        if (conversation) {

            return res.status(200).json({
                success: true,
                message:
                    "Conversation already exists",
                conversation
            });
        }


        conversation =
            await conversationModel.create({
                participants: [
                    swapRequest.requester,
                    swapRequest.receiver
                ],

                swapRequest: swapRequestId
            });


        return res.status(201).json({
            success: true,
            message:
                "Conversation created",
            conversation
        });


    } catch (error) {

        console.error(
            "Create conversation error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations =
            await conversationModel
                .find({
                    participants: userId
                })
                .populate(
                    "participants",
                    "fullname profileImage"
                )
                .populate(
                    "swapRequest",
                    "requestedItem offeredItem status"
                )
                .sort({
                    lastMessageAt: -1,
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {

        console.error(
            "Get conversations error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
