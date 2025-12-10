export default function permission(roles = null){
    return (req, res, next) => {
        if (!req.user){
            return res.status(401).json({err : "Utilisateur pas connecté"})
        }
     if (roles.includes(req.user.role)){
        return res.status(403).json({err: "Vous n'etes pas autorisé a effectué cette action"})
     }
     next()
    }
}