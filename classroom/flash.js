const flash = require("connect-flash");
const express = require("express");
const app = express();
const session = require('express-session');

const port = 3000 ;

const sessionOptions = {
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true ,
    },
};

app.use(session(sessionOptions));

app.use(flash()); 

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/" , (req , res) => {
    req.flash("success" , "Place Added Successfully !!");
    res.render("flash.ejs");
    res.send("done!!");
})


app.listen(port , (req , res) => {
    console.log("working");
});