export default function permission(roles = []) {
  return (req, res, next) => {
    const role = req.user?.role
    if (!role) {
      return res.status(401).json({ err: "Utilisateur pas connecté" })
    }

    if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
      return res.status(403).json({ err: "Vous n'etes pas autorisé a effectué cette action" })
    }

    next()
  }
}
