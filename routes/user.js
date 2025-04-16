const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controller/user.js");

router.route("/signup").get(userController.signup).post(userController.userSignup);

router.route("/login").get(userController.login).post(passport.authenticate('local' , { failureRedirect : '/listing' , failureFlash : true }) ,userController.userLogin);

router.get("/logout" , userController.logout );

module.exports = router;