import app from "./src/app.js";
import dotenv from "dotenv";
import connectToDB from "./src/config/db.js";
import { createServer } from "http";
import { initializeSocket } from "./src/socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {

    try {

        await connectToDB();

        const httpServer = createServer(app);

        initializeSocket(httpServer);

        httpServer.listen(PORT, () => {
            console.log(
                `Server is running on port ${PORT}`
            );
        });

    } catch (error) {

        console.log(
            "Failed to start server",
            error.message
        );

        process.exit(1);
    }
};

startServer();