import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: function () {
                return !this.googleId;
            }
        },

        fullname: {
            type: String,
            required: true,
            trim: true
        },

        contact: {
            type: String,
            trim: true
        },

        profileImage: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        googleId: {
            type: String
        },

        location: {
            city: {
                type: String,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            pincode: {
                type: String,
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
        }
    },
    {
        timestamps: true
    }
);


// Hash password before saving
userSchema.pre("save", async function () {

    if (!this.isModified("password") || !this.password) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});


// Compare password
userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(
        password,
        this.password
    );
};


// Geolocation index
userSchema.index({
    "location.coordinates": "2dsphere"
});


const userModel = mongoose.model("User", userSchema);

export default userModel;