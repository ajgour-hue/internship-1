import { Router } from "express";

import {
    createClothing,
    getClothes,
    getClothingById,
    getMyListings,
    updateClothing,
    deleteClothing,
    getNearbyClothes,
    getNearbyClothesForUser,
    getClothingRecommendations,
} from "../controller/clothing.controller.js";

import {
    authenticateUser,
} from "../middleware/auth.middleware.js";

import {
    uploadClothingImages,
} from "../middleware/upload.middleware.js";

import {
    validateClothing,
} from "../validator/clothing.validator.js";

const router = Router();


// ==========================================
// CREATE CLOTHING
// ==========================================

router.post(
    "/",
    authenticateUser,
    uploadClothingImages,
    validateClothing,
    createClothing
);


// ==========================================
// MY LISTINGS
// ==========================================

router.get(
    "/my-listings",
    authenticateUser,
    getMyListings
);


// ==========================================
// NEARBY
// ==========================================

router.get(
    "/nearby",
    getNearbyClothes
);


router.get(
    "/nearby/me",
    authenticateUser,
    getNearbyClothesForUser
);


// ==========================================
// RECOMMENDATIONS
// ==========================================

router.get(
    "/recommendations/:clothingId",
    authenticateUser,
    getClothingRecommendations
);


// ==========================================
// BROWSE / SEARCH / FILTER
// ==========================================

router.get(
    "/",
    getClothes
);


// ==========================================
// SINGLE CLOTHING
// ==========================================

router.get(
    "/:id",
    getClothingById
);


// ==========================================
// UPDATE
// ==========================================

router.patch(
    "/:id",
    authenticateUser,
    updateClothing
);


// ==========================================
// DELETE
// ==========================================

router.delete(
    "/:id",
    authenticateUser,
    deleteClothing
);

export default router;