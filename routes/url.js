
const express = require("express");
const router = express.Router();
const Url = require("../models/url");
const { nanoid } = require("nanoid");
const { isLoggedIn } = require("../middleware/auth");
router.post("/create", isLoggedIn, async (req, res) => {





let { originalUrl, customCode } = req.body;

let shortCode = customCode || nanoid(6);

//duplicate check
const existing = await Url.findOne({
    shortCode
});

if (existing) {
    req.flash("error", "This custom short code is already in use.");
    return res.redirect("/");
}
    // let newUrl = new Url({
    //     originalUrl,
    //     shortCode,
    //     owner: req.user._id
    // });

    let newUrl = new Url({
    originalUrl,
    shortCode,
    owner: req.user._id
});

    await newUrl.save();

    
//     res.render("urls/result", {
//     shortUrl: `http://localhost:9090/${shortCode}`
// });

res.render("urls/result", {
    shortUrl: `${process.env.BASE_URL}/${shortCode}`
});
});

//dashboard
router.get("/dashboard", isLoggedIn, async (req, res) => {

    const { search } = req.query;

    let filter = {
        owner: req.user._id
    };

    if (search && search.trim()) {

        const keyword = search.trim().replace("http://localhost:9090/", "");

        filter.$or = [
            {
                originalUrl: {
                    $regex: keyword,
                    $options: "i"
                }
            },
            {
                shortCode: {
                    $regex: keyword,
                    $options: "i"
                }
            }
        ];
    }

    const urls = await Url.find(filter);

    res.render("urls/dashboard", { urls });

});
// update
router.put("/:id", isLoggedIn, async (req, res) => {

    const { id } = req.params;
    const { originalUrl } = req.body;

    await Url.findByIdAndUpdate(id, {
        originalUrl
    });

    req.flash("success", "URL updated successfully!");
    res.redirect("/url/dashboard");
});

//delete
router.delete("/:id", isLoggedIn, async (req, res) => {

    const { id } = req.params;

    await Url.findByIdAndDelete(id);

    req.flash("success", "URL deleted successfully!");
    res.redirect("/url/dashboard");
});
module.exports = router;