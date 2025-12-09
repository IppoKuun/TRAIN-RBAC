import user from "../models/user.js"

export default async function login(req, res){
    //Quand login appelée, on prends user + MDP qu'on a recu pour les vérifié//
    try{
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({err:"Username ou password manquant"})
    }

    const doc = await user.findOne({username}).select("+passwordHash") 
    if (!doc){
        return res.status(400).json({err: "Utilisateur introuvable"})
    }
    const ok = await doc.checkPassword(password)
    if (!ok) {
        return res.status(400).json({err : "Mots de passe incorrecte"})
    }

    if (!req.session) {
        return res.status(500).json({err: "[LOGIN] SESSION MANQUANTE"})
    }

    // On regene nvl ID de session pour prévenir la fixation de cookies //
    await new Promise((resolve, reject) =>
    req.session.regenerate((err) => err ? reject(err): resolve())
    )
    // On créer une propriété user dans la session //
    req.session.user = {username: doc.username , role: doc.role}
    return res.status(200).json({user : req.session.user})
} catch(err){
    console.error("[LOGIN] erreur:", e);
    return res.status(500).json({"[LOGIN] Erreur connexion:": err})
}

}