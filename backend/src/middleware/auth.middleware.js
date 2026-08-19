import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
import { config } from "../config/config.js";


export const authenticateUser = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            config.JWT_SECRET
        );

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};


export const authenticateAdmin = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            config.JWT_SECRET
        );

        const user = await userModel
            .findById(decoded.id)
            .select("role");

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Authorization error:",
            error.message
        );

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};