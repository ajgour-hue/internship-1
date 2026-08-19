import socket from "../../socket/socket.js";
import { useEffect } from "react";

useEffect(() => {

    socket.connect();

    return () => {
        socket.disconnect();
    };

}, []);

useEffect(() => {

    if (!conversationId) {
        return;
    }

    socket.emit(
        "join_conversation",
        conversationId
    );

}, [conversationId]);

useEffect(() => {

    const handleNewMessage = (message) => {

        setMessages((prev) => [
            ...prev,
            message
        ]);

    };

    socket.on(
        "new_message",
        handleNewMessage
    );

    return () => {

        socket.off(
            "new_message",
            handleNewMessage
        );

    };

}, []);
