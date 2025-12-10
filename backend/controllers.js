import staff from "./models/staff";

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
    const created = await staff.create(data)
    if (!created){
        return res.status(500).json({err : " [controllers] Impossible de créer l'utilisateur"})
    }

    return res.status(200)
}

export async function updatedStaff(req, res){
    const targetID = req.params.id
    const updateData = req.body.data

        if(!targetID){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }
    const targetUser = await staff.findById(targetID)
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

    const updated = await staff.findByIdAndUpdate(targetID, updateData, {new :true})
    if (!updated){
        return res.status(500).json({err : "[controllers] erreur lors de la modification"})
    }
}

export async function deleteStaff(req, res){
    const targetID = req.params.id
    if(!targetID){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }

        if(!targetID){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }
    const targetUser = await findById(targetID)
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

    
    return res.status(200)
}
