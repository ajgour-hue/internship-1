import { createBrowserRouter } from "react-router-dom";

import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";

import Explore from "../features/clothing/pages/Explore.jsx";
import ClothingDetail from "../features/clothing/pages/ClothingDetail.jsx";
import CreateClothing from "../features/clothing/pages/CreateClothing.jsx";
import MyClothes from "../features/clothing/pages/MyClothes.jsx";
import EditClothing from "../features/clothing/pages/EditClothing.jsx";
import NearbyClothes from "../features/clothing/pages/NearbyClothes.jsx";
import LocationSetup from "../features/clothing/pages/LocationSetup.jsx";
import SentSwaps from "../features/clothing/pages/SentSwaps.jsx";
import ReceivedSwaps from "../features/clothing/pages/ReceivedSwaps.jsx";
import Notifications from "../features/clothing/pages/Notifications.jsx";
import Chat from "../features/clothing/pages/Chat.jsx";
import Profile from "../features/auth/pages/Profile.jsx";
import AppLayout from "./AppLayout.jsx";


export const routes = createBrowserRouter([

    // =========================
    // AUTH ROUTES
    // =========================

    {
        path: "/register",
        element: <Register />,
    },

    {
        path: "/login",
        element: <Login />,
    },


    // =========================
    // MAIN APP
    // =========================

    {
        element: <AppLayout />,

        children: [

            {
                path: "/",
                element: <Explore />,
            },

            {
                path: "/clothes/:clothingId",
                element: <ClothingDetail />,
            },

            {
                path: "/create-clothing",
                element: <CreateClothing />,
            },

            {
                path: "/my-clothes",
                element: <MyClothes />,
            },

            {
                path: "/clothes/:clothingId/edit",
                element: <EditClothing />,
            },

            {
                path: "/nearby-clothes",
                element: <NearbyClothes />,
            },

            {
                path: "/location-setup",
                element: <LocationSetup />,
            },

            {
                path: "/swaps/sent",
                element: <SentSwaps />,
            },

            {
                path: "/swaps/received",
                element: <ReceivedSwaps />,
            },

            {
                path: "/notifications",
                element: <Notifications />,
            },

            {
                path: "/profile",
                element: <Profile />,
            },

        ],
    },

    {
    path: "/chat",
    element: <Chat />,
},

]);