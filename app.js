require("dotenv").config();



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const Url = require("./models/url");
const urlRouter = require("./routes/url");
const app = express();
const userRouter = require("./routes/user");
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl, {
        dbName: "urlshortener",
    });
}



const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


//user signup
app.use("/users", userRouter);

// url convert
app.use("/url", urlRouter);





app.use((req,res,next)=>{

    res.locals.currentUser = req.user;

    next();

});






main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));



// //url  not found ka he
// app.get("/:shortCode", async (req, res) => {

//     const { shortCode } = req.params;

//     const url = await Url.findOne({ shortCode });

//     if (!url) {
//         return res.send("URL not found");
//     }

//     url.clicks++;
//     await url.save();

//     res.redirect(url.originalUrl);
// });




// app.get("/", (req, res) => {
//     res.send("URL Shortener Working");
// });
app.get("/", (req, res) => {
    res.render("home");
});


// last route
app.get("/:shortCode", async (req, res) => {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
        return res.send("URL not found");
    }

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
});

// app.listen(9090, () => {
//     console.log("Server listening 9090");
// });

const port = process.env.PORT || 9090;

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});