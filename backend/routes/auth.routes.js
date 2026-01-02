import express from "express"
import login from "../auth/login.js"
import logout from "../auth/logout.js"


export const authRoute = express.Router()

authRoute.post("/login", login)
authRoute.post("/logout", logout)
authRoute.get("/me", (req, res) => {

    if (!req.session || !req.session.user) {
        return res.status(200).json({ 
            cur: null, 
            isAuthenticated: false,
            err: "User pas authentifié"
        });
    }
    const cur = req.session.user
    return res.status(200).json({cur: cur, isAuthenticated: true})
})