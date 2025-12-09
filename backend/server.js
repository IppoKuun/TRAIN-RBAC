import mongoose from "mongoose";
import envConfig from "./env.js";
import express from "express"
import cors from "cors"
import MongoStore from "connect-mongo"
import helmet from "helmet"
import session from "express-session"
import { authRoute } from "./routes/auth.routes.js";



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
app.use(express.json())
app.use(cors({origin : 'http://localhost:3000', credentials:true, }))
app.use(express.json({ limit: '1kb' }));   
app.use(express.urlencoded({ extended: true }));


// SESSION QUI SERA STOCKER CHEZ MONGO //
const mongoSession = MongoStore.create({
    mongoUrl: url,
    ttl: envConfig.Cookies.COOKIE_MAX_AGE
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
    Cookies:{
        httpOnly: true, sameSite:envConfig.Cookies.COOKIE_MAX_AGE,
         maxAge:envConfig.Cookies.COOKIE_MAX_AGE , secure: envConfig.Cookies.COOKIE_SECURE
    },
    secret: envConfig.SESSION_SECRET
}))

// INITIALISATION DE NOS ROUTES//
app.use("/login", authRoute)
app.get("/health", (req, res) => {
    res.status(200).json({status:"ok"})    
})


// METTRE RATE LIMIT //

app.use((req, res) => res.status(404).json({error : "Not Found"}))
app.use((err, req, res, next) => {
    const dev = envConfig.env === "developpement"
 const payload = {
    status: res.status || 500,
    value: err.msg || err.message || "[Express-async-error] erreur serveur",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
 }
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
