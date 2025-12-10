import express from "express"
import * as controller "../controllers"

const staffRoute = express.Router()

staffRoute.get("/", controller.staffList)
staffRoute.post("/", controller.createdStaff)
staffRoute.delete("/", controller.deleteStaff)
staffRoute.patch("/", controller.updatedStaff)