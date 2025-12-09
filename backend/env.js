import dotenv from "dotenv"

dotenv.config()
// Récupération des variable dans le .env
const env = process.env === "production" ? "production" : "developpement"

const RAW = {
    PORT : Number(process.env.PORT),
    MONGO_URI : process.env.MONGO_URI ,
    SESSION_SECRET : process.env.SESSION_SECRET,
    TRUST_PROXY : Number(process.env.TRUST_PROXY) || 0,
    COOKIE_SAME_SITE : process.env.COOKIE_SAME_SITE || "lax",
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
    COOKIE_SECURE: env === "production" ? true : false,
}

//QLQ gardes fous 
if (!RAW.MONGO_URI || !RAW.SESSION_SECRET){
    throw new Error("[ENV.JS] Pas de Mongo_URI ou de Session_Secret.")
}

if (env ==="production" && COOKIE_SAME_SITE === "none" &&  !COOKIE_SECURE){
    throw new Error("[ENV.JS] EN PROD ACTIVER COOKIE SECURE QUAND SAMESITE NONE")
}

const envConfig = Object.freeze({
    PORT: RAW.PORT,
    env,
    TRUST_PROXY : RAW.TRUST_PROXY,
    MONGO_URI: RAW.MONGO_URI,
    SESSION_SECRET: RAW.SESSION_SECRET,
    Cookies: {
        COOKIE_MAX_AGE :RAW.COOKIE_MAX_AGE, 
        COOKIE_SECURE: RAW.COOKIE_SECURE, 
        COOKIE_SAME_SITE: RAW.COOKIE_SAME_SITE
        ,
    }
})

export default envConfig