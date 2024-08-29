const { Router } = require("express");
const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");
const multer  = require('multer');
const path = require("path");

const router = Router();

const storage = multer.diskStorage({
       destination: function (req, file, cb) {
         cb(null, path.resolve("./public/uploads"));
       },
       filename: function (req, file, cb) {
         const fileName = `${Date.now()}-${file.originalname}`;
         cb(null, fileName);
       }
});
 
const upload = multer({ storage: storage });   

router.get("/new-blog",(req,res) => {
       return res.render("addBlog",{
        user : req.user,
       });   
});

router.get("/:id", async (req,res) => {
       if (!req.user) {  // Checking if the user is not authenticated
              // Instead of alert, send a message back to the client or redirect
              return res.redirect("/user/signin");
       } 
       else {
          const blog = await Blog.findById(req.params.id).populate("createdBy");
          const comments = await Comment.find({blogId : req.params.id}).populate("createdBy");
         // console.log("Blog",blog);
          return res.render("blog",{
          user : req.user,
          blog,
          comments,
       });   
     }
});

router.post("/", upload.single("coverImage"), async (req,res) => {
       const { title, body} = req.body;
       const blog = await Blog.create({
             title,
             body,
             coverImageURL: `/uploads/${req.file.filename}`,
             createdBy: req.user._id,
       });
       // console.log(blog);
       return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async(req,res) => {
     await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id,
     });
     return res.redirect(`/blog/${req.params.blogId}`);
});

router.get("/delete/:blogId", async (req,res) => {
       const b = await Blog.findByIdAndDelete(req.params.blogId);
      // console.log("B:",b);
      if(req.user.role === "ADMIN"){
       return res.redirect("/");
      }
      else { return res.redirect("/myblogs"); }
});

module.exports = router;