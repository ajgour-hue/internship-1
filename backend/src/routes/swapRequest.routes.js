import { Router } from "express";

import {
    createSwapRequest,
    getSentSwapRequests,
    getReceivedSwapRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    compareSwapValues,
    confirmSwap,
    completeSwap
} from "../controller/swapRequest.controller.js";

import {
    authenticateUser
} from "../middleware/auth.middleware.js";

const router = Router();


// Create
router.post(
    "/",
    authenticateUser,
    createSwapRequest
);


// Compare swap values
router.get(
    "/compare",
    authenticateUser,
    compareSwapValues
);


// Sent
router.get(
    "/sent",
    authenticateUser,
    getSentSwapRequests
);


// Received
router.get(
    "/received",
    authenticateUser,
    getReceivedSwapRequests
);


// Accept
router.patch(
    "/:id/accept",
    authenticateUser,
    acceptSwapRequest
);


// Reject
router.patch(
    "/:id/reject",
    authenticateUser,
    rejectSwapRequest
);


// Cancel
router.patch(
    "/:id/cancel",
    authenticateUser,
    cancelSwapRequest
);

// Confirm Swap
router.patch(
    "/:id/confirm",
    authenticateUser,
    confirmSwap
);

router.patch(
    "/:id/complete",
    authenticateUser,
    completeSwap
);

export default router;