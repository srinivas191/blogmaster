const { Router } = require("express");
const User = require("../models/user.js");

const router = Router();


router.get("/signup",(req,res) => {
    return res.render("signup");
});
router.get("/signin",(req,res) => {
    return res.render("signin");
});

router.post("/signin",async(req,res) => {
    const { email, password } = req.body;
   try {
    const token = await User.matchPasswordAndGenerateToken(email,password);
    // console.log("Token :",token);
    
    return res.cookie("token",token).redirect("/myblogs");
   } catch(error){
     return res.render("signin",{
       error : "Wrong Email or Password",
     });
   }
});

 router.get("/logout", (req,res) => {
    return res.clearCookie("token").redirect("/");
 });

router.post("/signup",async(req,res) => {
    const { fullName, email, password,role } = req.body;
    const user = await User.create({
        fullName,
        email,
        password,
        role,
    });
     console.log("User",user)
    return res.redirect("/");
    
});

module.exports = router;