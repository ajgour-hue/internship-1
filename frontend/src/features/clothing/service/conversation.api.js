import axios from "axios";

const conversationApiInstance = axios.create({
    baseURL: `${
        import.meta.env.VITE_BACKEND_URL ||
        "https://internship-1-vafq.onrender.com"
    }/api/conversations`,
    withCredentials: true,
});


// Create / get conversation
export async function createConversation(
    swapRequestId
) {
    const response =
        await conversationApiInstance.post("/", {
            swapRequestId,
        });

    return response.data;
}


// Get user's conversations
export async function getConversations() {
    const response =
        await conversationApiInstance.get("/");

    return response.data;
}