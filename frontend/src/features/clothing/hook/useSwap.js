import {
    createSwapRequest,
    compareSwapValues,
    getSentSwapRequests,
    cancelSwapRequest,
    getReceivedSwapRequests,
    acceptSwapRequest,
    rejectSwapRequest,
} from "../service/swap.api.js";


export const useSwap = () => {


    // Create swap request
    const handleCreateSwapRequest = async ({
        requestedItem,
        offeredItem,
        message = "",
    }) => {

        return await createSwapRequest({
            requestedItem,
            offeredItem,
            message,
        });

    };


    // Compare swap values
    const handleCompareSwapValues = async ({
        requestedItem,
        offeredItem,
    }) => {

        return await compareSwapValues({
            requestedItem,
            offeredItem,
        });

    };


    // Get sent swap requests
    const handleGetSentSwapRequests = async () => {

        return await getSentSwapRequests();

    };


    // Cancel swap request
    const handleCancelSwapRequest = async (
        swapId
    ) => {

        return await cancelSwapRequest(
            swapId
        );

    };


    // Get received swap requests
    const handleGetReceivedSwapRequests = async () => {

        return await getReceivedSwapRequests();

    };


    // Accept swap request
    const handleAcceptSwapRequest = async (
        swapId
    ) => {

        return await acceptSwapRequest(
            swapId
        );

    };


    // Reject swap request
    const handleRejectSwapRequest = async (
        swapId
    ) => {

        return await rejectSwapRequest(
            swapId
        );

    };


    return {

        handleCreateSwapRequest,

        handleCompareSwapValues,

        handleGetSentSwapRequests,

        handleCancelSwapRequest,

        handleGetReceivedSwapRequests,

        handleAcceptSwapRequest,

        handleRejectSwapRequest,

    };

};