import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import { useConversation } from "../hook/useConversation.js";

import {
    getMessages,
    sendMessage,
} from "../service/message.api.js";


const SOCKET_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:3000";


const Chat = () => {

    const user = useSelector(
        (state) => state.auth.user
    );

    const {
        handleGetConversations,
    } = useConversation();


    const [conversations, setConversations] =
        useState([]);

    const [activeConversation, setActiveConversation] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [text, setText] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [messagesLoading, setMessagesLoading] =
        useState(false);

    const [sending, setSending] =
        useState(false);


    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);


    /* =========================
       LOAD CONVERSATIONS
    ========================= */

    useEffect(() => {

        if (!user) return;


        const loadConversations = async () => {

            try {

                setLoading(true);

                const response =
                    await handleGetConversations();

                setConversations(
                    response?.conversations || []
                );

            } catch (error) {

                console.error(
                    "Failed to load conversations:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


        loadConversations();

    }, [user]);


    /* =========================
       SOCKET CONNECTION
    ========================= */

    useEffect(() => {

        if (!user) return;


        const socket = io(
            SOCKET_URL,
            {
                withCredentials: true,
            }
        );


        socketRef.current = socket;


        socket.on("connect", () => {

            console.log(
                "Socket connected:",
                socket.id
            );

        });


        socket.on(
            "new_message",
            (newMessage) => {

                if (
                    !activeConversation ||
                    newMessage.conversation !==
                        activeConversation._id
                ) {
                    return;
                }


                setMessages(
                    (previousMessages) => {

                        const alreadyExists =
                            previousMessages.some(
                                (message) =>
                                    message._id ===
                                    newMessage._id
                            );


                        if (alreadyExists) {
                            return previousMessages;
                        }


                        return [
                            ...previousMessages,
                            newMessage,
                        ];

                    }
                );

            }
        );


        socket.on("disconnect", () => {

            console.log(
                "Socket disconnected"
            );

        });


        return () => {

            socket.disconnect();

            socketRef.current = null;

        };

    }, [user, activeConversation]);


    /* =========================
       SELECT CONVERSATION
    ========================= */

    const handleSelectConversation =
        async (conversation) => {

            try {

                setActiveConversation(
                    conversation
                );

                setMessages([]);

                setMessagesLoading(true);


                const response =
                    await getMessages(
                        conversation._id
                    );


                setMessages(
                    response?.messages || []
                );


                if (
                    socketRef.current
                ) {

                    socketRef.current.emit(
                        "join_conversation",
                        conversation._id
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );

            } finally {

                setMessagesLoading(false);

            }

        };


    /* =========================
       AUTO SCROLL
    ========================= */

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    /* =========================
       OTHER USER
    ========================= */

    const getOtherUser = (
        conversation
    ) => {

        if (
            !conversation?.participants ||
            !user
        ) {
            return null;
        }


        return conversation.participants.find(
            (participant) =>
                participant._id !== user._id
        );

    };


    /* =========================
       SEND MESSAGE
    ========================= */

    const handleSendMessage =
        async (event) => {

            if (event) {
                event.preventDefault();
            }


            const messageText =
                text.trim();


            if (
                !messageText ||
                !activeConversation ||
                sending
            ) {
                return;
            }


            try {

                setSending(true);


                const response =
                    await sendMessage({
                        conversationId:
                            activeConversation._id,
                        text:
                            messageText,
                    });


                const newMessage =
                    response?.message;


                if (newMessage) {

                    setMessages(
                        (previousMessages) => {

                            const exists =
                                previousMessages.some(
                                    (message) =>
                                        message._id ===
                                        newMessage._id
                                );


                            if (exists) {
                                return previousMessages;
                            }


                            return [
                                ...previousMessages,
                                newMessage,
                            ];

                        }
                    );

                }


                setText("");


            } catch (error) {

                console.error(
                    "Failed to send message:",
                    error
                );

            } finally {

                setSending(false);

            }

        };


    /* =========================
       ENTER TO SEND
    ========================= */

    const handleKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSendMessage();

        }

    };


    /* =========================
       TIME FORMAT
    ========================= */

    const formatTime = (
        date
    ) => {

        if (!date) return "";

        return new Date(date)
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );

    };


    return (

        <div className="
            min-h-[calc(100vh-72px)]
            bg-neutral-50
        ">

            <div className="
                max-w-7xl
                mx-auto
                px-4
                sm:px-6
                lg:px-8
                py-6
            ">

                <div className="
                    h-[calc(100vh-120px)]
                    min-h-[600px]
                    bg-white
                    border
                    border-neutral-200
                    rounded-2xl
                    overflow-hidden
                    flex
                ">

                    {/* =========================
                        CONVERSATIONS
                    ========================= */}

                    <aside className="
                        w-[320px]
                        shrink-0
                        border-r
                        border-neutral-200
                        flex
                        flex-col
                    ">

                        <div className="
                            px-5
                            py-5
                            border-b
                            border-neutral-200
                        ">

                            <h1 className="
                                text-xl
                                font-semibold
                                text-black
                            ">
                                Messages
                            </h1>

                            <p className="
                                text-xs
                                text-neutral-400
                                mt-1
                            ">
                                Your conversations
                            </p>

                        </div>


                        <div className="
                            flex-1
                            overflow-y-auto
                        ">

                            {loading ? (

                                <div className="
                                    p-6
                                    text-center
                                    text-sm
                                    text-neutral-400
                                ">
                                    Loading...
                                </div>

                            ) : conversations.length === 0 ? (

                                <div className="
                                    p-8
                                    text-center
                                ">

                                    <div className="
                                        text-3xl
                                        mb-3
                                    ">
                                        💬
                                    </div>

                                    <p className="
                                        text-sm
                                        font-medium
                                    ">
                                        No conversations
                                    </p>

                                    <p className="
                                        text-xs
                                        text-neutral-400
                                        mt-1
                                    ">
                                        Your accepted swaps
                                        will appear here.
                                    </p>

                                </div>

                            ) : (

                                conversations.map(
                                    (conversation) => {

                                        const otherUser =
                                            getOtherUser(
                                                conversation
                                            );


                                        const active =
                                            activeConversation?._id ===
                                            conversation._id;


                                        return (

                                            <button
                                                key={
                                                    conversation._id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSelectConversation(
                                                        conversation
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    px-5
                                                    py-4
                                                    text-left
                                                    border-b
                                                    border-neutral-100
                                                    transition
                                                    ${
                                                        active
                                                            ? "bg-neutral-100"
                                                            : "hover:bg-neutral-50"
                                                    }
                                                `}
                                            >

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    {otherUser?.profileImage ? (

                                                        <img
                                                            src={
                                                                otherUser.profileImage
                                                            }
                                                            alt=""
                                                            className="
                                                                w-11
                                                                h-11
                                                                rounded-full
                                                                object-cover
                                                            "
                                                        />

                                                    ) : (

                                                        <div className="
                                                            w-11
                                                            h-11
                                                            rounded-full
                                                            bg-neutral-200
                                                            flex
                                                            items-center
                                                            justify-center
                                                            font-semibold
                                                        ">
                                                            {
                                                                otherUser?.fullname
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() ||
                                                                "U"
                                                            }
                                                        </div>

                                                    )}


                                                    <div className="
                                                        min-w-0
                                                        flex-1
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            font-semibold
                                                            truncate
                                                        ">
                                                            {
                                                                otherUser?.fullname ||
                                                                "User"
                                                            }
                                                        </p>

                                                        <p className="
                                                            text-xs
                                                            text-neutral-400
                                                            truncate
                                                            mt-1
                                                        ">
                                                            {
                                                                conversation.lastMessage ||
                                                                "No messages yet"
                                                            }
                                                        </p>

                                                    </div>


                                                    {conversation.lastMessageAt && (

                                                        <span className="
                                                            text-[10px]
                                                            text-neutral-400
                                                        ">
                                                            {
                                                                formatTime(
                                                                    conversation.lastMessageAt
                                                                )
                                                            }
                                                        </span>

                                                    )}

                                                </div>

                                            </button>

                                        );

                                    }
                                )

                            )}

                        </div>

                    </aside>


                    {/* =========================
                        CHAT
                    ========================= */}

                    <section className="
                        flex
                        flex-1
                        flex-col
                        min-w-0
                    ">

                        {!activeConversation ? (

                            <div className="
                                flex-1
                                flex
                                items-center
                                justify-center
                                text-center
                            ">

                                <div>

                                    <div className="
                                        text-5xl
                                        mb-4
                                    ">
                                        💬
                                    </div>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                    ">
                                        Select a conversation
                                    </h2>

                                    <p className="
                                        text-sm
                                        text-neutral-400
                                        mt-1
                                    ">
                                        Choose a conversation
                                        to start chatting.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <>

                                {/* HEADER */}

                                <header className="
                                    h-[72px]
                                    shrink-0
                                    px-6
                                    border-b
                                    border-neutral-200
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    {(() => {

                                        const otherUser =
                                            getOtherUser(
                                                activeConversation
                                            );


                                        return (

                                            <>

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-neutral-200
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-semibold
                                                    overflow-hidden
                                                ">

                                                    {otherUser?.profileImage ? (

                                                        <img
                                                            src={
                                                                otherUser.profileImage
                                                            }
                                                            alt=""
                                                            className="
                                                                w-full
                                                                h-full
                                                                object-cover
                                                            "
                                                        />

                                                    ) : (

                                                        otherUser?.fullname
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                        "U"

                                                    )}

                                                </div>


                                                <div>

                                                    <h2 className="
                                                        text-sm
                                                        font-semibold
                                                    ">
                                                        {
                                                            otherUser?.fullname ||
                                                            "User"
                                                        }
                                                    </h2>

                                                    <p className="
                                                        text-xs
                                                        text-neutral-400
                                                    ">
                                                        FashionKart
                                                    </p>

                                                </div>

                                            </>

                                        );

                                    })()}

                                </header>


                                {/* MESSAGES */}

                                <div className="
                                    flex-1
                                    overflow-y-auto
                                    bg-neutral-50
                                    px-6
                                    py-6
                                ">

                                    {messagesLoading ? (

                                        <div className="
                                            h-full
                                            flex
                                            items-center
                                            justify-center
                                            text-sm
                                            text-neutral-400
                                        ">
                                            Loading messages...
                                        </div>

                                    ) : messages.length === 0 ? (

                                        <div className="
                                            h-full
                                            flex
                                            items-center
                                            justify-center
                                            text-center
                                        ">

                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                ">
                                                    No messages yet
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-neutral-400
                                                    mt-1
                                                ">
                                                    Send the first message.
                                                </p>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="
                                            space-y-3
                                        ">

                                            {messages.map(
                                                (message) => {

                                                    const isMine =
                                                        message.sender?._id ===
                                                        user?._id;


                                                    return (

                                                        <div
                                                            key={
                                                                message._id
                                                            }
                                                            className={`
                                                                flex
                                                                ${
                                                                    isMine
                                                                        ? "justify-end"
                                                                        : "justify-start"
                                                                }
                                                            `}
                                                        >

                                                            <div className={`
                                                                max-w-[70%]
                                                                px-4
                                                                py-3
                                                                rounded-2xl
                                                                ${
                                                                    isMine
                                                                        ? "bg-black text-white rounded-br-md"
                                                                        : "bg-white border border-neutral-200 text-black rounded-bl-md"
                                                                }
                                                            `}>

                                                                <p className="
                                                                    text-sm
                                                                    whitespace-pre-wrap
                                                                    break-words
                                                                ">
                                                                    {
                                                                        message.text
                                                                    }
                                                                </p>


                                                                <p className="
                                                                    text-[10px]
                                                                    text-neutral-400
                                                                    text-right
                                                                    mt-1
                                                                ">
                                                                    {
                                                                        formatTime(
                                                                            message.createdAt
                                                                        )
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    );

                                                }
                                            )}

                                            <div
                                                ref={
                                                    messagesEndRef
                                                }
                                            />

                                        </div>

                                    )}

                                </div>


                                {/* INPUT */}

                                <form
                                    onSubmit={
                                        handleSendMessage
                                    }
                                    className="
                                        shrink-0
                                        p-4
                                        border-t
                                        border-neutral-200
                                        bg-white
                                    "
                                >

                                    <div className="
                                        flex
                                        gap-3
                                        items-end
                                    ">

                                        <textarea
                                            value={text}
                                            onChange={(event) =>
                                                setText(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={
                                                handleKeyDown
                                            }
                                            placeholder="Write a message..."
                                            maxLength={2000}
                                            rows={1}
                                            className="
                                                flex-1
                                                resize-none
                                                border
                                                border-neutral-200
                                                rounded-2xl
                                                px-4
                                                py-3
                                                text-sm
                                                outline-none
                                                focus:border-black
                                            "
                                        />


                                        <button
                                            type="submit"
                                            disabled={
                                                !text.trim() ||
                                                sending
                                            }
                                            className="
                                                px-5
                                                py-3
                                                rounded-2xl
                                                bg-black
                                                text-white
                                                text-sm
                                                font-medium
                                                transition
                                                hover:bg-neutral-800
                                                disabled:opacity-40
                                                disabled:cursor-not-allowed
                                            "
                                        >
                                            {sending
                                                ? "..."
                                                : "Send"}
                                        </button>

                                    </div>

                                </form>

                            </>

                        )}

                    </section>

                </div>

            </div>

        </div>
    );
};


export default Chat;