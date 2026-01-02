import staff from "./models/staff.js";

export async function staffList(req, res){
    const doc = await staff.find()
    if (!doc){
        return res.status(500).json({err : "[controllers] Impossible d'afficher la list"})
    }
    return res.status(200).json({doc})
}

export async function createdStaff(req, res){
    const {data} = req.body
    if (!data){
        return res.status(500).json({err : " [controllers] Reception de data impossible"})
    }
    if (!data.password){
        return res.status(400).json({err : "Mot de passe manquant"})
    }
    // A METTRE APRES AVOIR CREERE LE PREMIER USER //
    if (data.role === "owner"){
        return res.status(401).json({ err : "Impossible de créer un nouvelle owner."})
    }

    if (req.user.role !== "owner"){
        if (data.role === "admin"){
            return res.status(401).json({err : "Uniquement owner peut créer un admin."})
        }
    }

    if (req.user.role === "viewer") {
        return res.status(403).json({err : "Vous n'avez pas les droits pour créer un membre du staff"})
    }

    const { password, ...rest } = data
    const doc = new staff(rest)
    await doc.setPassword(password)

    const created = await doc.save()
    if (!created){
        return res.status(500).json({err : " [controllers] Impossible de créer l'utilisateur"})
    }

    return res.status(201).json({ id: created._id })
}

export async function updatedStaff(req, res){
    const targetID = req.params.id
    const updateData = req.body.data

        if(!targetID){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }
    const targetUser = await staff.findById(targetID)
    if (!targetUser) {
        return res.status(404).json({ err: "[controllers] Utilisateur introuvable" })
    }
    if (req.user.role !== "owner"){
        if (targetUser.role === "owner"){
            return res.status(401).json({err : "Uniquement owner peut modifié owner"})
        }
    }

    if (targetUser.role === "admin"){
        if (req.user.role !== "owner"){
            return res.status(401).json({err : "Uniquement owner peut modifié admin."})
        }
    }

    // Hash un nouveau mot de passe si fourni
    if (updateData && updateData.password) {
        targetUser.password = updateData.password
        await targetUser.setPassword(updateData.password)
        delete updateData.password
    }

    const updated = await staff.findByIdAndUpdate(targetID, updateData, {new :true})
    if (!updated){
        return res.status(500).json({err : "[controllers] erreur lors de la modification"})
    }
    return res.status(200).json({ updated })
}

export async function deleteStaff(req, res){
    const targetID = req.params.id
    if(!targetID){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }

        if(!targetID){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }
    const targetUser = await staff.findById(targetID)
    if (!targetUser){
        return res.status(404).json({err : "[controllers] Utilisateur introuvable"})
    }
        if (targetUser.role === "owner"){
            return res.status(401).json({err : "Impossible de supprimer owner"})
        }


    if (targetUser.role === "admin"){
        if (req.user.role !== "owner"){
            return res.status(401).json({err : "Uniquement owner peut supprimé admin."})
        }
    }
    const deleted = await staff.findByIdAndDelete(targetID)

    if(!deleted){
        return res.status(500).json({err : "[controllers] impossible de supprimer le staff"})
    }


    return res.status(200).json({ deleted: targetID })
}
