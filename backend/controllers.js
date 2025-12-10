import staff from "./models/staff";

export async function staffList(req, req){
    const doc = staff.find()
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
    const created = staff.created(data)
    if (!created){
        return res.status(500).json({err : " [controllers] Impossible de créer l'utilisateur"})
    }

    return res.status(200)
}

export async function updatedStaff(req, res){
    const {_id} = req.body
    if(!_id){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }
    const updated = staff.findByIdAndUpdate(_id)
    if (!updated){
        return res.status(500).json({err : "[controllers] erreur lors de la modification"})
    }
}

export async function deleteStaff(req, res){
   const {_id} = req.body
    if(!_id){
        return res.status(500).json({err : "[controllers] l'ID du staff n'as pas été récupérée"})
    }
    const deleted = staff.findByIdAndDelete(_id)

    if(!deleted){
        return res.status(500).json({err : "[controllers] impossible de supprimer le staff"})
    }
    return res.status(200)
}
