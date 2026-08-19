import mongoose from "mongoose";

const clothingSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        category: {
            type: String,
            required: true,
            enum: [
                "T-Shirt",
                "Shirt",
                "Jeans",
                "Trousers",
                "Jacket",
                "Hoodie",
                "Sweater",
                "Dress",
                "Skirt",
                "Shorts",
                "Saree",
                "Kurta",
                "Other"
            ]
        },

        brand: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: String,
            required: true,
            enum: [
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "XXL",
                "XXXL",
                "Free Size"
            ]
        },

        condition: {
            type: String,
            required: true,
            enum: [
                "New",
                "Like New",
                "Excellent",
                "Good",
                "Fair"
            ]
        },

        images: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 1 && value.length <= 6;
                },
                message: "Upload between 1 and 6 images"
            }
        },

        estimatedSwapValue: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            },

            coordinates: {
                type: {
                    type: String,
                    enum: ["Point"],
                    default: "Point"
                },

                coordinates: {
                    type: [Number],
                    default: [0, 0]
                }
            }
        },

        status: {
            type: String,
            enum: [
                "available",
                "pending",
                "swapped",
                "removed"
            ],
            default: "available",
            index: true
        }
    },
    {
        timestamps: true
    }
);


// Geospatial index
clothingSchema.index({
    "location.coordinates": "2dsphere"
});


// Search/filter indexes
clothingSchema.index({
    category: 1,
    size: 1,
    condition: 1
});

clothingSchema.index({
    brand: 1
});


const clothingModel = mongoose.model(
    "Clothing",
    clothingSchema
);

export default clothingModel;