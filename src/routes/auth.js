
const auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401);
        res.json({ error: true, err_code: 1, message: "Unauthorized" });
    }
}

module.exports = {
    auth
}