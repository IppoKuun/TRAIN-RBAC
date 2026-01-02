export default function requireAuth(roles = null) {
  return (req, res, next) => {
    const sessUser = req.session ? req.session.user : null

    if (!sessUser) {
      return res.status(401).json({ err: "Utilisateur non connecté" })
    }

    req.user = sessUser

    if (Array.isArray(roles) && roles.length > 0) {
      if (!roles.includes(sessUser.role)) {
        return res.status(401).json({ err: "Accès interdit." })
      }
    }
    next()
  }
}
