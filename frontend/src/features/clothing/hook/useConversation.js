import {
    createConversation,
    getConversations,
} from "../service/conversation.api.js";


export const useConversation = () => {

    // Create / get conversation
    const handleCreateConversation = async (
        swapRequestId
    ) => {

        return await createConversation(
            swapRequestId
        );

    };


    // Get user's conversations
    const handleGetConversations = async () => {

        return await getConversations();

    };


    return {
        handleCreateConversation,
        handleGetConversations,
    };
};