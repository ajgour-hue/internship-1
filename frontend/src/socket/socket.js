import { io } from "socket.io-client";

const socket = io(
    "https://internship-1-vafq.onrender.com",
    {
        withCredentials: true,
        autoConnect: false
    }
);

export default socket;