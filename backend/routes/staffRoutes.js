import express from "express"
import * as controller from "../controllers.js"
import permission from "../middlewares/permission.js"
import requireAuth from "../middlewares/requireAuth.js"

const staffRoute = express.Router()

staffRoute.get("/", requireAuth(), controller.staffList)
staffRoute.post("/", requireAuth(), permission(["owner", "admin"]) ,controller.createdStaff)
staffRoute.delete("/:id", requireAuth(), permission(["owner", "admin"]), controller.deleteStaff)
staffRoute.patch("/:id", requireAuth(), permission(["owner", "admin"]),controller.updatedStaff)

export default staffRoute
