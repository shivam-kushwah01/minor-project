const User = require("../model/user");
const passport = require("passport");

module.exports.signup = (req , res) => {
    res.render("./user/signup.ejs");
};


module.exports.userSignup = async(req , res , next) => {
    try{
    let { username , password , email } = req.body ;
    const newUser = new User({email , username});
    const registeredUser = await User.register(newUser , password);
    req.login(registeredUser , (err) => {
        if(err){
            next(err);
        }
        req.flash("success", `Hello ${username}, Welcome to Wonderlust!`);
        res.redirect("/");
    })  
    }
    catch(err){
        console.log("error hai");
        console.log(err);
        res.redirect("/signup");
    }
};

module.exports.login = (req , res) => {
    res.render("./user/login.ejs");
};


module.exports.userLogin = async(req , res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login?error=auth-failed');
    
    // THIS IS CRUCIAL: Attaches user to session
    req.login(user, (err) => {
      if (err) return next(err);
      console.log('Session after login:', req.session); // Debug
      res.redirect('/profile');
    });
  })(req, res, next);
};
// {
//     req.flash("success", "Login successfully!!");
//     res.redirect("/");
// };

module.exports.logout =  (req , res , next) => {
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/");
    })
};