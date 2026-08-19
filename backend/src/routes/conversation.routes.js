import { Router } from "express";

import {
    createConversation,
    getConversations,
} from "../controller/conversation.controller.js";

import {
    authenticateUser,
} from "../middleware/auth.middleware.js";


const router = Router();


// Create / get conversation
router.post(
    "/",
    authenticateUser,
    createConversation
);


// Get user's conversations
router.get(
    "/",
    authenticateUser,
    getConversations
);


export default router;