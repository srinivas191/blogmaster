const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication.js");

const Blog = require("./models/blog.js");

const userRoute = require("./routes/user.js");
const blogRoute = require("./routes/blog.js");

PORT = 8000;
const app = express();
mongoose
   .connect("mongodb://localhost:27017/blogify")
   .then((e) => console.log("MongoDb Connected"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended : false}));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.get("/", async (req,res) => {
      const allBlogs = await Blog.find({});
      res.render("home",{
         user : req.user,
         blogs: allBlogs,
      });
});

app.get("/myblogs", async (req,res) => {
   const allBlogs = await Blog.find({createdBy : req.user._id});
   res.render("MyBlogs",{
      user : req.user,
      blogs: allBlogs,
   });
});


app.listen(PORT, () => console.log(`server listen on port : ${PORT}`));
