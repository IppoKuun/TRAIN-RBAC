import mongoose from "mongoose";
import staff from "./models/staff.js"
import envConfig from "./env.js";

     async function seed(){
    const url = envConfig.MONGO_URI
    await mongoose.connect(url)

    mdpHash = staff.setPassword("pcoaRr4ErfXGkLNCuHxv")

    const user = {
        username:"Owner_staff_test",

    }
}
