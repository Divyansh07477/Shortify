const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
// router.get("/signup", (req, res) => {
//     res.send("Signup Page");
// });
router.get("/signup", (req, res) => {
    res.render("users/signup", { page: "auth" });
});

router.post("/signup", async (req, res) => {

    try {

        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser, password);

        req.flash("success", "Account created successfully!");

        res.redirect("/users/login");

    } catch (err) {

        console.log(err);

        req.flash("error", "User already Register");

        res.redirect("/users/signup");
    }

});



router.get("/login", (req, res) => {
    res.render("users/login", { page: "auth" });
});














//login
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome Back!");
        res.redirect("/url/dashboard");
    }
);


//logout
router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged Out Successfully");
        res.redirect("/");
    });
});

module.exports = router;