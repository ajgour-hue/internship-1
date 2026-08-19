import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clothes: [],
    myListings: [],
    selectedClothing: null,
    recommendations: [],
    nearbyClothes: [],
    loading: false,
    error: null,
};

const clothingSlice = createSlice({
    name: "clothing",

    initialState,

    reducers: {
        setClothes: (state, action) => {
            state.clothes = action.payload;
        },

        setMyListings: (state, action) => {
            state.myListings = action.payload;
        },

        setSelectedClothing: (state, action) => {
            state.selectedClothing = action.payload;
        },

        setRecommendations: (state, action) => {
            state.recommendations = action.payload;
        },

        setNearbyClothes: (state, action) => {
            state.nearbyClothes = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        clearSelectedClothing: (state) => {
            state.selectedClothing = null;
        },

        clearError: (state) => {
            state.error = null;
        },
        removeMyListing: (state, action) => {
    state.myListings = state.myListings.filter(
        (clothing) => clothing._id !== action.payload
    );
},
    },
});

export const {
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
} = clothingSlice.actions;

export default clothingSlice.reducer;