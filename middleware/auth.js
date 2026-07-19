// Url.find({
//     owner: req.user._id
// })

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect("/users/login");
    }

    next();
};