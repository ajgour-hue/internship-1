import axios from "axios";


const clothingApiInstance = axios.create({

    baseURL: `${
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:3000"
    }/api/clothes`,

    withCredentials: true,
});


// ==========================================
// CREATE CLOTHING
// ==========================================

export async function createClothing(
    clothingData
) {

    const response =
        await clothingApiInstance.post(
            "/",
            clothingData
        );

    return response.data;
}


// ==========================================
// GET ALL CLOTHES
// ==========================================

export async function getClothes(
    params = {}
) {

    const response =
        await clothingApiInstance.get(
            "/",
            {
                params,
            }
        );

    return response.data;
}


// ==========================================
// GET CLOTHING BY ID
// ==========================================

export async function getClothingById(
    clothingId
) {

    const response =
        await clothingApiInstance.get(
            `/${clothingId}`
        );

    return response.data;
}


// ==========================================
// GET MY LISTINGS
// ==========================================

export async function getMyListings() {

    const response =
        await clothingApiInstance.get(
            "/my-listings"
        );

    return response.data;
}


// ==========================================
// UPDATE CLOTHING
// ==========================================

export async function updateClothing(
    clothingId,
    clothingData
) {

    const response =
        await clothingApiInstance.patch(
            `/${clothingId}`,
            clothingData
        );

    return response.data;
}


// ==========================================
// DELETE CLOTHING
// ==========================================

export async function deleteClothing(
    clothingId
) {

    const response =
        await clothingApiInstance.delete(
            `/${clothingId}`
        );

    return response.data;
}


// ==========================================
// GET NEARBY CLOTHES
// ==========================================

export async function getNearbyClothes(
    params = {}
) {

    const response =
        await clothingApiInstance.get(
            "/nearby",
            {
                params,
            }
        );

    return response.data;
}


// ==========================================
// GET NEARBY CLOTHES FOR USER
// ==========================================

export async function getNearbyClothesForUser(
    params = {}
) {

    const response =
        await clothingApiInstance.get(
            "/nearby/me",
            {
                params,
            }
        );

    return response.data;
}


// ==========================================
// RECOMMENDATIONS
// ==========================================

export async function getClothingRecommendations(
    clothingId
) {

    const response =
        await clothingApiInstance.get(
            `/recommendations/${clothingId}`
        );

    return response.data;
}