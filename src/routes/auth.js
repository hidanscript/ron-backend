
const authUser = (req, res, next) => {
    if(req.session.passport.user) {
        next();
    } else {
        res.status(401);
        res.json({ error: true, err_code: 1, message: "Unauthorized" });
    }
}

module.exports = {
    authUser
}