import userModel from "../model/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";


async function sendTokenResponse(user, res, message) {

    const token = jwt.sign(
        {
            id: user._id,
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role,
            location: user.location,
            
        },
    });
}


export const register = async (req, res) => {

    const {
        email,
        password,
        fullname,
        contact
    } = req.body;

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User with same email or contact already exists"
            });
        }

        const user = await userModel.create({
            email,
            password,
            fullname,
            contact,
            role: "user"
        });

        await sendTokenResponse(
            user,
            res,
            "User registered successfully"
        );

    } catch (error) {

        console.error("Register error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const login = async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const match = await user.comparePassword(password);

        if (!match) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        await sendTokenResponse(
            user,
            res,
            "User logged in successfully"
        );

    } catch (error) {

        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getMe = async (req, res) => {

    const user = req.user;

    return res.status(200).json({
        message: "User fetched successfully",
        success: true,

        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role,
            profileImage: user.profileImage,
            location: user.location,
        },
    });
};


export const googleCallback = async (req, res) => {

    try {

        const {
            id,
            displayName,
            emails,
        } = req.user;

        const email = emails?.[0]?.value;

        if (!email) {
            return res.redirect(
                `${config.FRONTEND_URL}/login?error=google_email_missing`
            );
        }

        let user = await userModel.findOne({ email });

        if (!user) {

            user = await userModel.create({
                email,
                googleId: id,
                fullname: displayName,
                role: "user",
            });

        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(config.FRONTEND_URL);

    } catch (error) {

        console.error("Google authentication error:", error.message);

        return res.status(500).json({
            message: "Google authentication failed"
        });
    }
};

export const logout = async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production"
            ? "none"
            : "lax"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const updateProfile = async (req, res) => {

    try {

        const {
            fullname,
            contact,
            profileImage,
            location
        } = req.body;

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                fullname,
                contact,
                profileImage,
                location
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        console.error(
            "Profile update error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};