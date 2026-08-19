import axios from "axios";

const swapApiInstance = axios.create({
    baseURL: `${
        import.meta.env.VITE_BACKEND_URL ||
        "https://internship-1-vafq.onrender.com"
    }/api/swaps`,
    withCredentials: true,
});


// Create swap request
export async function createSwapRequest({
    requestedItem,
    offeredItem,
    message = "",
}) {
    const response = await swapApiInstance.post("/", {
        requestedItem,
        offeredItem,
        message,
    });

    return response.data;
}


// Get sent swap requests
export async function getSentSwapRequests() {
    const response = await swapApiInstance.get("/sent");

    return response.data;
}


// Cancel swap request
export async function cancelSwapRequest(swapId) {
    const response = await swapApiInstance.patch(
        `/${swapId}/cancel`
    );

    return response.data;
}


// Get received swap requests
export async function getReceivedSwapRequests() {
    const response = await swapApiInstance.get("/received");

    return response.data;
}


// Accept swap request
export async function acceptSwapRequest(swapId) {
    const response = await swapApiInstance.patch(
        `/${swapId}/accept`
    );

    return response.data;
}


// Reject swap request
export async function rejectSwapRequest(swapId) {
    const response = await swapApiInstance.patch(
        `/${swapId}/reject`
    );

    return response.data;
}

// Compare swap values
export async function compareSwapValues({
    requestedItem,
    offeredItem,
}) {
    const response = await swapApiInstance.get(
        "/compare",
        {
            params: {
                requestedItem,
                offeredItem,
            },
        }
    );

    return response.data;
}