import express from "express"
import requireAuth from "../auth/requireAuth.js"


export const authRoute = express.Router()

authRoute.post("/", LoginRateLimiter, login)
authRoute.post("/logout", logout)