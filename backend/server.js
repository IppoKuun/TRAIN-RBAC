import envConfig from "./env.js";
import app, { ensureDbConnected } from "./app.js";

async function start() {
    try {
        await ensureDbConnected();
        app.listen(envConfig.PORT);
        console.log("Serveur lancee sur :", `http://localhost:${envConfig.PORT}`);
    } catch (e) {
        console.error("[server.js] Echec du lancement du serveur", e);
        process.exit(1);
    }
}

start();
