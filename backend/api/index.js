// backend/api/index.js
import app, { ensureDbConnected } from "../app.js";

export default async (req, res) => {
    // On s'assure que la DB est connectée avant de traiter la requête
    await ensureDbConnected();
    return app(req, res);
};