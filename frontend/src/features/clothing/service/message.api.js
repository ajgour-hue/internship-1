import axios from "axios";


const messageApiInstance = axios.create({
    baseURL: `${
        import.meta.env.VITE_BACKEND_URL ||
        "https://internship-1-vafq.onrender.com"
    }/api/messages`,
    withCredentials: true,
});


// Send message
export async function sendMessage({
    conversationId,
    text,
}) {

    const response =
        await messageApiInstance.post(
            "/",
            {
                conversationId,
                text,
            }
        );

    return response.data;
}


// Get conversation messages
export async function getMessages(
    conversationId
) {

    const response =
        await messageApiInstance.get(
            `/${conversationId}`
        );

    return response.data;
}