import express from "express"
import * as controller from "../controllers.js"
import permission from "../middlewares/permission.js"

const staffRoute = express.Router()

staffRoute.get("/", controller.staffList)
staffRoute.post("/", permission(["owner", "admin"]) ,controller.createdStaff)
staffRoute.delete("/", permission(["owner", "admin"]), controller.deleteStaff)
staffRoute.patch("/", permission(["owner", "admin"]),controller.updatedStaff)

export default staffRoute