// backend/auth/logout.js
export default function logout(req, res, next) {
  if (!req.session) return res.status(200).json({ ok: true })

  const clearOpts = {
    sameSite: req.session.cookie?.sameSite,
    secure: req.session.cookie?.secure,
    httpOnly: req.session.cookie?.httpOnly,
  }

  req.session.destroy((err) => {
    if (err) return next(err)
    res.clearCookie("Express_session", clearOpts)
    res.status(200).json({ ok: true })
  })
}
