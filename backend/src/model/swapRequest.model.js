import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        requestedItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",
            required: true,
            index: true
        },

        offeredItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",
            required: true,
            index: true
        },

        message: {
            type: String,
            trim: true,
            maxlength: 500
        },

    valueComparison: {
    requestedValue: {
        type: Number,
        required: true
    },

    offeredValue: {
        type: Number,
        required: true
    },

    difference: {
        type: Number,
        required: true
    },

    differencePercentage: {
        type: Number,
        required: true
    },

    recommendation: {
        type: String,
        enum: [
            "excellent_match",
            "good_match",
            "fair_match",
            "large_value_difference"
        ],
        required: true
    }
},

confirmations: {
    requester: {
        type: Boolean,
        default: false
    },

    receiver: {
        type: Boolean,
        default: false
    }
},

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
                "confirmed",
                "completed"
            ],
            default: "pending",
            index: true
        }
    },
    {
        timestamps: true
    }
);


// Prevent exact duplicate active requests
swapRequestSchema.index({
    requester: 1,
    requestedItem: 1,
    offeredItem: 1,
    status: 1
});


const swapRequestModel = mongoose.model(
    "SwapRequest",
    swapRequestSchema
);

export default swapRequestModel;