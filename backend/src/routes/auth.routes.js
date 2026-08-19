import { Router } from "express";
import passport from "passport";

import {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    googleCallback
} from "../controller/auth.controller.js";

import {
    validateRegisterUser,
    validateLoginUser
} from "../validator/auth.validator.js";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { config } from "../config/config.js";

const router = Router();


router.post(
    "/register",
    validateRegisterUser,
    register
);


router.post(
    "/login",
    validateLoginUser,
    login
);


router.post(
    "/logout",
    logout
);


router.get(
    "/me",
    authenticateUser,
    getMe
);


router.patch(
    "/profile",
    authenticateUser,
    updateProfile
);


// Google OAuth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"]
    })
);


router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${config.FRONTEND_URL}/login`
    }),
    googleCallback
);


export default router;