import mongoose from "mongoose"
import { hashPassword, verifyPassword } from "../bcrypt.js"

const { Schema } = mongoose

const staffSchema = new Schema({
  staffname: { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["owner", "admin", "admin", "viewer"], default: "viewer" },
})

staffSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await hashPassword(plain)
}

staffSchema.methods.checkPassword = async function checkPassword(plain) {
  if (!this.passwordHash) {
    throw new Error("Il n'y a aucun mots de passe hashé.")
  }
  return verifyPassword(plain, this.passwordHash)
}


const staff = mongoose.model("staff", staffSchema)
export default staff
