import swapRequestModel from "../model/swapRequest.model.js";
import clothingModel from "../model/clothing.model.js";
import {
    calculateSwapValue
} from "../utils/swapValue.util.js";
import mongoose from "mongoose";
import {
    createNotification
} from "../utils/notification.util.js";

import conversationModel from "../model/conversation.model.js";

export const createSwapRequest = async (req, res) => {
    try {

        const {
            requestedItem,
            offeredItem,
            message
        } = req.body;

        // 1. Requested item
        const requestedClothing =
            await clothingModel.findById(requestedItem);

        if (!requestedClothing) {
            return res.status(404).json({
                message: "Requested clothing not found"
            });
        }

        // 2. Offered item
        const offeredClothing =
            await clothingModel.findById(offeredItem);

        if (!offeredClothing) {
            return res.status(404).json({
                message: "Offered clothing not found"
            });
        }

        // 3. Cannot swap with yourself
        if (
            requestedClothing.owner.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                message: "You cannot request your own clothing"
            });
        }

        // 4. User must own offered clothing
        if (
            offeredClothing.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only offer your own clothing"
            });
        }

        // 5. Both items must be available
        if (
            requestedClothing.status !== "available" ||
            offeredClothing.status !== "available"
        ) {
            return res.status(400).json({
                message: "Both clothing items must be available"
            });
        }

        // 6. Prevent duplicate active request
        const existingRequest =
            await swapRequestModel.findOne({
                requester: req.user._id,
                requestedItem,
                offeredItem,
                status: "pending"
            });

        if (existingRequest) {
            return res.status(409).json({
                message: "Swap request already exists"
            });
        }

        const receiver = requestedClothing.owner;


// Calculate swap value comparison
const valueComparison = calculateSwapValue(
    requestedClothing.estimatedSwapValue,
    offeredClothing.estimatedSwapValue
);


// Create swap request
const swapRequest =
    await swapRequestModel.create({
        requester: req.user._id,
        receiver,
        requestedItem,
        offeredItem,
        message,
        valueComparison
    });

await createNotification({
    recipient: receiver,
    sender: req.user._id,

    type: "swap_request",

    title: "New Swap Request",

    message:
        `${req.user.fullname} sent you a swap request.`,

    swapRequest: swapRequest._id
});

        const populatedRequest =
            await swapRequestModel
                .findById(swapRequest._id)
                .populate(
                    "requester",
                    "fullname email profileImage"
                )
                .populate(
                    "receiver",
                    "fullname email profileImage"
                )
                .populate(
                    "requestedItem"
                )
                .populate(
                    "offeredItem"
                );

        return res.status(201).json({
            success: true,
            message: "Swap request sent successfully",
            swapRequest: populatedRequest
        });

    } catch (error) {

        console.error(
            "Create swap request error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getSentSwapRequests = async (req, res) => {
    try {

        const requests =
            await swapRequestModel
                .find({
                    requester: req.user._id
                })
                .populate(
                    "receiver",
                    "fullname profileImage"
                )
                .populate(
                    "requestedItem"
                )
                .populate(
                    "offeredItem"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            requests
        });

    } catch (error) {

        console.error(
            "Get sent swap requests error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getReceivedSwapRequests = async (req, res) => {
    try {

        const requests =
            await swapRequestModel
                .find({
                    receiver: req.user._id
                })
                .populate(
                    "requester",
                    "fullname profileImage"
                )
                .populate(
                    "requestedItem"
                )
                .populate(
                    "offeredItem"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            requests
        });

    } catch (error) {

        console.error(
            "Get received swap requests error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};




export const acceptSwapRequest = async (req, res) => {
    try {

        const swapRequest =
            await swapRequestModel.findById(
                req.params.id
            );

        if (!swapRequest) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }


        // Only receiver can accept
        if (
            swapRequest.receiver.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the receiver can accept this request"
            });
        }


        // Request must be pending
        if (
            swapRequest.status !== "pending"
        ) {
            return res.status(400).json({
                message:
                    "Swap request is no longer pending"
            });
        }


        // Get requested clothing
        const requestedClothing =
            await clothingModel.findById(
                swapRequest.requestedItem
            );


        // Get offered clothing
        const offeredClothing =
            await clothingModel.findById(
                swapRequest.offeredItem
            );


        if (
            !requestedClothing ||
            !offeredClothing
        ) {
            return res.status(404).json({
                message:
                    "One or both clothing items not found"
            });
        }


        // Both clothing items must still be available
        if (
            requestedClothing.status !==
                "available" ||
            offeredClothing.status !==
                "available"
        ) {
            return res.status(409).json({
                message:
                    "One or both items are no longer available"
            });
        }


        // Reserve both items
        requestedClothing.status = "pending";
        offeredClothing.status = "pending";


        await requestedClothing.save();
        await offeredClothing.save();


        // Accept swap request
        swapRequest.status = "accepted";

        await swapRequest.save();


        // ==========================================
        // CREATE CONVERSATION
        // ==========================================

        let conversation =
            await conversationModel.findOne({
                swapRequest:
                    swapRequest._id
            });


        // Prevent duplicate conversation
        if (!conversation) {

            conversation =
                await conversationModel.create({

                    participants: [
                        swapRequest.requester,
                        swapRequest.receiver
                    ],

                    swapRequest:
                        swapRequest._id,

                    lastMessage: "",

                    lastMessageAt: null
                });
        }


        // ==========================================
        // NOTIFICATION
        // ==========================================

        await createNotification({

            recipient:
                swapRequest.requester,

            sender:
                req.user._id,

            type:
                "swap_accepted",

            title:
                "Swap Request Accepted",

            message:
                `${req.user.fullname} accepted your swap request.`,

            swapRequest:
                swapRequest._id
        });


        // ==========================================
        // REJECT CONFLICTING REQUESTS
        // ==========================================

        await swapRequestModel.updateMany(
            {
                _id: {
                    $ne: swapRequest._id
                },

                status: "pending",

                $or: [

                    {
                        requestedItem:
                            swapRequest.requestedItem
                    },

                    {
                        offeredItem:
                            swapRequest.requestedItem
                    },

                    {
                        requestedItem:
                            swapRequest.offeredItem
                    },

                    {
                        offeredItem:
                            swapRequest.offeredItem
                    }
                ]
            },

            {
                $set: {
                    status: "rejected"
                }
            }
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Swap request accepted",

            swapRequest,

            conversation
        });


    } catch (error) {

        console.error(
            "Accept swap request error:",
            error.message
        );


        return res.status(500).json({

            message:
                "Internal server error"
        });
    }
};
export const rejectSwapRequest = async (req, res) => {
    try {

        const swapRequest =
            await swapRequestModel.findById(
                req.params.id
            );

        if (!swapRequest) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        if (
            swapRequest.receiver.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Only the receiver can reject this request"
            });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({
                message: "Swap request is no longer pending"
            });
        }

        swapRequest.status = "rejected";

        await swapRequest.save();

        await createNotification({
    recipient: swapRequest.requester,
    sender: req.user._id,

    type: "swap_rejected",

    title: "Swap Request Rejected",

    message:
        `${req.user.fullname} rejected your swap request.`,

    swapRequest: swapRequest._id
});

        return res.status(200).json({
            success: true,
            message: "Swap request rejected"
        });

    } catch (error) {

        console.error(
            "Reject swap request error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const cancelSwapRequest = async (req, res) => {
    try {

        const swapRequest =
            await swapRequestModel.findById(
                req.params.id
            );

        if (!swapRequest) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        if (
            swapRequest.requester.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Only the requester can cancel this request"
            });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({
                message: "Only pending requests can be cancelled"
            });
        }

        swapRequest.status = "cancelled";

        await swapRequest.save();

        await createNotification({
    recipient: swapRequest.receiver,
    sender: req.user._id,

    type: "swap_cancelled",

    title: "Swap Request Cancelled",

    message:
        `${req.user.fullname} cancelled the swap request.`,

    swapRequest: swapRequest._id
});

        return res.status(200).json({
            success: true,
            message: "Swap request cancelled"
        });

    } catch (error) {

        console.error(
            "Cancel swap request error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const compareSwapValues = async (req, res) => {

    try {

        const {
            requestedItem,
            offeredItem
        } = req.query;

        const requestedClothing =
            await clothingModel.findById(requestedItem);

        const offeredClothing =
            await clothingModel.findById(offeredItem);

        if (!requestedClothing) {
            return res.status(404).json({
                message: "Requested clothing not found"
            });
        }

        if (!offeredClothing) {
            return res.status(404).json({
                message: "Offered clothing not found"
            });
        }

        if (
            offeredClothing.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only offer your own clothing"
            });
        }

        const comparison = calculateSwapValue(
            requestedClothing.estimatedSwapValue,
            offeredClothing.estimatedSwapValue
        );

        return res.status(200).json({
            success: true,
            comparison
        });

    } catch (error) {

        console.error(
            "Swap comparison error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const confirmSwap = async (req, res) => {

    try {

        const swapRequest =
            await swapRequestModel.findById(
                req.params.id
            );

        if (!swapRequest) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }


        if (swapRequest.status !== "accepted") {
            return res.status(400).json({
                message:
                    "Only accepted swaps can be confirmed"
            });
        }


        const userId =
            req.user._id.toString();


        const requesterId =
            swapRequest.requester.toString();

        const receiverId =
            swapRequest.receiver.toString();


        if (
            userId !== requesterId &&
            userId !== receiverId
        ) {
            return res.status(403).json({
                message:
                    "You are not part of this swap"
            });
        }


        // Mark current user's confirmation
        if (userId === requesterId) {
            swapRequest.confirmations.requester = true;
        }

        if (userId === receiverId) {
            swapRequest.confirmations.receiver = true;
        }

        const recipient =
    userId === requesterId
        ? swapRequest.receiver
        : swapRequest.requester;

await createNotification({
    recipient,
    sender: req.user._id,

    type: "swap_confirmed",

    title: "Swap Confirmation",

    message:
        `${req.user.fullname} confirmed the swap.`,

    swapRequest: swapRequest._id
});

        // Only mark confirmed when BOTH confirm
        const bothConfirmed =
            swapRequest.confirmations.requester &&
            swapRequest.confirmations.receiver;


        if (!bothConfirmed) {

            await swapRequest.save();

            return res.status(200).json({
                success: true,
                message:
                    "Swap confirmation recorded",
                status: "accepted",
                confirmations:
                    swapRequest.confirmations
            });
        }


        swapRequest.status = "confirmed";

        await swapRequest.save();


        return res.status(200).json({
            success: true,
            message:
                "Both users confirmed the swap",
            status: "confirmed"
        });


    } catch (error) {

        console.error(
            "Confirm swap error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};



export const completeSwap = async (req, res) => {

    const session =
        await mongoose.startSession();

    try {

        session.startTransaction();


        const swapRequest =
            await swapRequestModel
                .findById(req.params.id)
                .session(session);


        if (!swapRequest) {

            await session.abortTransaction();

            return res.status(404).json({
                message: "Swap request not found"
            });
        }


        if (
            swapRequest.status !== "confirmed"
        ) {

            await session.abortTransaction();

            return res.status(400).json({
                message:
                    "Both users must confirm the swap first"
            });
        }


        const userId =
            req.user._id.toString();


        const isParticipant =
            swapRequest.requester.toString() === userId ||
            swapRequest.receiver.toString() === userId;


        if (!isParticipant) {

            await session.abortTransaction();

            return res.status(403).json({
                message:
                    "You are not part of this swap"
            });
        }


        const requestedClothing =
            await clothingModel
                .findById(
                    swapRequest.requestedItem
                )
                .session(session);


        const offeredClothing =
            await clothingModel
                .findById(
                    swapRequest.offeredItem
                )
                .session(session);


        if (
            !requestedClothing ||
            !offeredClothing
        ) {

            await session.abortTransaction();

            return res.status(404).json({
                message:
                    "One or both clothing items not found"
            });
        }


        // Verify current ownership
        if (
            requestedClothing.owner.toString() !==
            swapRequest.receiver.toString()
        ) {

            await session.abortTransaction();

            return res.status(409).json({
                message:
                    "Requested clothing ownership has changed"
            });
        }


        if (
            offeredClothing.owner.toString() !==
            swapRequest.requester.toString()
        ) {

            await session.abortTransaction();

            return res.status(409).json({
                message:
                    "Offered clothing ownership has changed"
            });
        }


        // Transfer ownership
        requestedClothing.owner =
            swapRequest.requester;

        offeredClothing.owner =
            swapRequest.receiver;


        // Mark items as swapped
        requestedClothing.status = "swapped";
        offeredClothing.status = "swapped";


        await requestedClothing.save({
            session
        });

        await offeredClothing.save({
            session
        });


        // Complete swap
        swapRequest.status = "completed";

        await swapRequest.save({
            session
        });


        await session.commitTransaction();

        await createNotification({
    recipient: swapRequest.requester,
    sender: req.user._id,

    type: "swap_completed",

    title: "Swap Completed",

    message:
        "Your clothing swap has been completed.",

    swapRequest: swapRequest._id
});


await createNotification({
    recipient: swapRequest.receiver,
    sender: req.user._id,

    type: "swap_completed",

    title: "Swap Completed",

    message:
        "Your clothing swap has been completed.",

    swapRequest: swapRequest._id
});



        return res.status(200).json({
            success: true,
            message:
                "Swap completed successfully",
            status: "completed"
        });


    } catch (error) {

        await session.abortTransaction();

        console.error(
            "Complete swap error:",
            error.message
        );

        return res.status(500).json({
            message:
                "Failed to complete swap"
        });

    } finally {

        session.endSession();
    }
};
