import { Router } from "express";

import {
    sendMessage,
    getMessages,
} from "../controller/message.controller.js";

import {
    authenticateUser,
} from "../middleware/auth.middleware.js";


const router = Router();


// Send message
router.post(
    "/",
    authenticateUser,
    sendMessage
);


// Get conversation messages
router.get(
    "/:conversationId",
    authenticateUser,
    getMessages
);


export default router;