import mongoose from "mongoose";
import envConfig from "./env.js";
import express from "express"
import cors from "cors"
import MongoStore from "connect-mongo"
import helmet from "helmet"
import session from "express-session"
import { authRoute } from "./routes/auth.routes.js";
import staffRoute from "./routes/staffRoutes.js";


const url = envConfig.MONGO_URI

//Fonction qui se connecte a Mongo//
async function connectDB(){
    await mongoose.connect(url)
}
// logs utiles
mongoose.connection.on("connected", () => console.log("[db] connected event"));
mongoose.connection.on("error", (err) => console.error("[db] error event:", err));
mongoose.connection.on("disconnected", () => console.warn("[db] disconnected"));
//CONFIGUARATION DE NOTRE SERVER//
const app = express()
app.set("trust proxy", envConfig.TRUST_PROXY)

app.use(cors({
    origin : process.env.FRONT_ORIGIN || 'http://localhost:3000',
    credentials:true,
}))
app.use(express.json({ limit: '1kb' }));   
app.use(express.urlencoded({ extended: true }));


// SESSION QUI SERA STOCKER CHEZ MONGO //
const mongoSession = MongoStore.create({
    mongoUrl: url,
    ttl: Math.floor(envConfig.Cookies.COOKIE_MAX_AGE / 1000)
})

app.use(helmet.noSniff());
app.use(helmet({ frameguard: true }));

// INITIALISATION DE LA SESSION //
app.use(session({
    // A TEST//
    resave:false,
    saveUninitialized:true,
    name:"Express_session",
    store: mongoSession,
    cookie:{
        httpOnly: true,
        sameSite: envConfig.Cookies.COOKIE_SAME_SITE,
        maxAge: envConfig.Cookies.COOKIE_MAX_AGE,
        secure: envConfig.Cookies.COOKIE_SECURE
    },
    secret: envConfig.SESSION_SECRET
}))

// INITIALISATION DE NOS ROUTES//
app.use("/auth", authRoute)
app.get("/health", (req, res) => {
    res.status(200).json({status:"ok"})    
})
app.use("/staffRoutes", staffRoute)


// METTRE RATE LIMIT //

app.use((req, res) => res.status(404).json({error : "Not Found"}))
app.use((err, req, res, next) => {
    const dev = envConfig.env === "developpement"
 const payload = {
    status: res.statusCode && res.statusCode !== 200 ? res.statusCode : 500,
    value: err?.msg || err?.message || "[Express-async-error] erreur serveur",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
 }
 res.status(payload.status).json(payload)
})

// DEMARRAGE DU SERV //
async function start(){
    await connectDB()
    try{
    app.listen(envConfig.PORT)
    console.log("Serveur lancée sur :", `http://localhost:${envConfig.PORT}`)

    } catch(e){
        console.error("[Server.js] Echec du lancement du serveur ", e),
        process.exit(1)
    }
}

start()
