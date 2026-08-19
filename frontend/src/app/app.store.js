import { configureStore } from "@reduxjs/toolkit";

import authSlice from "../features/auth/state/auth.slice.js";
import clothingSlice from "../features/clothing/state/clothing.slice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        clothing: clothingSlice,
    },
});