import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import clothingRouter from "./routes/clothing.routes.js";
import swapRequestRouter from "./routes/swapRequest.routes.js";
import conversationRouter from "./routes/conversation.routes.js";
import messageRouter from "./routes/message.routes.js";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

app.use(compression());

// CORS
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://fashion-kart-sigma.vercel.app",
        ],
        credentials: true,
    })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Auth routes
app.use("/api/auth", authRouter);

// Clothing Routes
app.use(
    "/api/clothes",
    clothingRouter
);

app.use(
    "/api/conversations",
    conversationRouter
);

app.use(
    "/api/messages",
    messageRouter
);


app.use(
    "/api/notifications",
    notificationRouter
);

// Swap Request Routes .
app.use(
    "/api/swaps",
    swapRequestRouter
);


// Passport
app.use(passport.initialize());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

export default app;