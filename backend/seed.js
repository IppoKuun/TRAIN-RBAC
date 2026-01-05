import mongoose from "mongoose";
import staff from "./models/staff.js"
import envConfig from "./env.js";

    export default async function seed(){
    const url = envConfig.MONGO_URI
    await mongoose.connect(url)

        const newOwner = new staff({
                    username: "Owner_staff_test",
                    email: "the_real@mail.com", 
                    role: "owner"
                });

            await newOwner.setPassword("pcoaRr4ErfXGkLNCuHxv");
             await newOwner.save();
    mongoose.connection.close()
}

seed()

