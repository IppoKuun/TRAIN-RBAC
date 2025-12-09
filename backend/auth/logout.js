export default async function logout(req, res){
    const sessName = req.session.name
    const cookies = req.session.cookies

    const clearOpts = {
        sameSite: cookies.sameSite,
        secure: cookies.secure,
        httpOnly: cookies.httpOnly,
    };

    if (!req.session){
        res.clearCookies(sessName, clearOpts)
    }

    await new Promise((resolve, reject) => {
        res.session.destroy(err ? reject(err) : resolve())
        res.clearCookies(sessName, clearOpts)
    })

    return res.status(200).json({ok: true})
}