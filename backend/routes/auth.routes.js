import express from "express"
import login from "../auth/login.js"
import logout from "../auth/logout.js"


export const authRoute = express.Router()

authRoute.post("/", login)
authRoute.post("/", logout)