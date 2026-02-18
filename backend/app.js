import mongoose from "mongoose";
import envConfig from "./env.js";
import express from "express";
import cors from "cors";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import session from "express-session";
import { authRoute } from "./routes/auth.routes.js";
import staffRoute from "./routes/staffRoutes.js";

const url = envConfig.MONGO_URI;
const app = express();

let dbConnectPromise = null;

export async function ensureDbConnected() {
    if (mongoose.connection.readyState === 1) return;
    if (!dbConnectPromise) {
        dbConnectPromise = mongoose.connect(url).catch((err) => {
            dbConnectPromise = null;
            throw err;
        });
    }
    await dbConnectPromise;
}

mongoose.connection.on("connected", () => console.log("[db] connected event"));
mongoose.connection.on("error", (err) => console.error("[db] error event:", err));
mongoose.connection.on("disconnected", () => console.warn("[db] disconnected"));

app.set("trust proxy", envConfig.TRUST_PROXY);

app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "1kb" }));
app.use(express.urlencoded({ extended: true }));

const mongoSession = MongoStore.create({
    mongoUrl: url,
    ttl: Math.floor(envConfig.Cookies.COOKIE_MAX_AGE / 1000),
});

app.use(helmet.noSniff());
app.use(helmet({ frameguard: true }));

app.use(session({
    resave: false,
    saveUninitialized: true,
    name: "Express_session",
    store: mongoSession,
    cookie: {
        httpOnly: true,
        sameSite: envConfig.Cookies.COOKIE_SAME_SITE,
        maxAge: envConfig.Cookies.COOKIE_MAX_AGE,
        secure: envConfig.Cookies.COOKIE_SECURE,
    },
    secret: envConfig.SESSION_SECRET,
}));

app.use(async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (e) {
        next(e);
    }
});

app.use("/auth", authRoute);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use("/staffRoutes", staffRoute);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));
app.use((err, req, res, next) => {
    const payload = {
        status: res.statusCode && res.statusCode !== 200 ? res.statusCode : 500,
        value: err?.msg || err?.message || "[Express-async-error] erreur serveur",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    };
    res.status(payload.status).json(payload);
});

export default app;
