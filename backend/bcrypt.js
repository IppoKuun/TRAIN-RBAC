import bcrypt from "bcrypt"


 const BCRYPT_COST=12

export async function hashPassword(password){
    if (password === "" || typeof password !== "string" )
        throw new Error("[BCRYPT] Mots de passe vide ou pas un string")
    const salt = await bcrypt.genSalt(BCRYPT_COST)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export async function verifyPassword(password, hash){
        if (typeof password !== "string" || password.length === 0) return false;
        if (typeof hash !== "string" || hash.length === 0) return false;
        return bcrypt.compare(password, hash)
}