import mongoose from "mongoose"
import { hashPassword, verifyPassword } from "../bcrypt.js"

const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["owner", "admin"], default: "admin" },
})

userSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await hashPassword(plain)
}

userSchema.methods.checkPassword = async function checkPassword(plain) {
  if (!this.passwordHash) {
    throw new Error("Il n'y a aucun mots de passe hashé.")
  }
  return verifyPassword(plain, this.passwordHash)
}


const User = mongoose.model("User", userSchema)
export default User
