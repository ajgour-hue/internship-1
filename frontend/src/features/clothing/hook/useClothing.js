    import {
        createClothing,
        getClothes,
        getClothingById,
        getMyListings,
        updateClothing,
        deleteClothing,
        getNearbyClothes,
        getNearbyClothesForUser,
        getClothingRecommendations
    } from "../service/clothing.api.js";

    import {
        setClothes,
        setMyListings,
        setSelectedClothing,
        setRecommendations,
        setNearbyClothes,
        setLoading,
        setError,
        clearSelectedClothing,
        clearError,
        removeMyListing,
    } from "../state/clothing.slice.js";

    import { useDispatch } from "react-redux";


    export const useClothing = () => {

        const dispatch = useDispatch();


        // Get all clothes
        const handleGetClothes = async (params = {}) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data = await getClothes(params);

                dispatch(
                    setClothes(
                        data.clothes || []
                    )
                );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch clothes";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Get clothing by ID
        const handleGetClothingById = async (
            clothingId
        ) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await getClothingById(clothingId);

                dispatch(
                    setSelectedClothing(
                        data.clothing || data
                    )
                );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch clothing";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Get my listings
        const handleGetMyListings = async () => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await getMyListings();

                dispatch(
                    setMyListings(
                        data.clothes ||
                        data.listings ||
                        []
                    )
                );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch your listings";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Create clothing
        const handleCreateClothing = async (
            clothingData
        ) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await createClothing(
                        clothingData
                    );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to create clothing";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Update clothing
        const handleUpdateClothing = async (
            clothingId,
            clothingData
        ) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await updateClothing(
                        clothingId,
                        clothingData
                    );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to update clothing";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Delete clothing
    const handleDeleteClothing = async (clothingId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const data = await deleteClothing(clothingId);

            // Remove immediately from Redux
            dispatch(removeMyListing(clothingId));

            return data;

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Failed to delete clothing";

            dispatch(setError(message));

            throw error;

        } finally {
            dispatch(setLoading(false));
        }
    };


        // Nearby clothes
        const handleGetNearbyClothes = async (
            params = {}
        ) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await getNearbyClothes(params);

                dispatch(
                    setNearbyClothes(
                        data.clothes || []
                    )
                );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch nearby clothes";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Nearby clothes for logged-in user
        const handleGetNearbyClothesForUser = async (
            params = {}
        ) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await getNearbyClothesForUser(
                        params
                    );

                dispatch(
                    setNearbyClothes(
                        data.clothes || []
                    )
                );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch nearby clothes";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Recommendations
        const handleGetClothingRecommendations = async (
            clothingId
        ) => {

            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const data =
                    await getClothingRecommendations(
                        clothingId
                    );

                dispatch(
                    setRecommendations(
                        data.recommendations || []
                    )
                );

                return data;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch recommendations";

                dispatch(setError(message));

                throw error;

            } finally {
                dispatch(setLoading(false));
            }
        };


        // Clear selected clothing
        const handleClearSelectedClothing = () => {
            dispatch(clearSelectedClothing());
        };


        return {
            handleGetClothes,
            handleGetClothingById,
            handleGetMyListings,
            handleCreateClothing,
            handleUpdateClothing,
            handleDeleteClothing,
            handleGetNearbyClothes,
            handleGetNearbyClothesForUser,
            handleGetClothingRecommendations,
            handleClearSelectedClothing
        };
    };