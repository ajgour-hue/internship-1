import { Server } from "socket.io";

let io;

export const initializeSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://fashion-kart-sigma.vercel.app"
            ],
            credentials: true
        }
    });


  io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );


    // User notification room
    socket.on(
        "join_user",
        (userId) => {

            socket.join(
                `user:${userId}`
            );

            console.log(
                `${socket.id} joined user room`
            );
        }
    );


    // Chat room
    socket.on(
        "join_conversation",
        (conversationId) => {

            socket.join(
                `conversation:${conversationId}`
            );

        }
    );


    socket.on("disconnect", () => {

        console.log(
            "Socket disconnected:",
            socket.id
        );

    });

});


    return io;
};


export const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.io has not been initialized"
        );
    }

    return io;
};