import express from "express"
import * as controller from "../controllers.js"
import permission from "../middlewares/permission.js"
import requireAuth from "../middlewares/requireAuth.js"
import { adminGlobalLimits } from "../rateLimits.js"

const staffRoute = express.Router()

staffRoute.get("/", adminGlobalLimits, requireAuth(), controller.staffList)
staffRoute.post("/", adminGlobalLimits, requireAuth(), permission(["owner", "admin"]) ,controller.createdStaff)
staffRoute.delete("/:id", adminGlobalLimits, requireAuth(), permission(["owner", "admin"]), controller.deleteStaff)
staffRoute.patch("/:id", adminGlobalLimits, requireAuth(), permission(["owner", "admin"]),controller.updatedStaff)

export default staffRoute
