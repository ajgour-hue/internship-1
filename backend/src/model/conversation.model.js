import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],

        swapRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SwapRequest",
            required: true,
            unique: true
        },

        lastMessage: {
            type: String,
            default: ""
        },

        lastMessageAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


conversationSchema.index({
    participants: 1
});


const conversationModel = mongoose.model(
    "Conversation",
    conversationSchema
);

export default conversationModel;