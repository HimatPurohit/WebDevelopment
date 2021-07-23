const express = require("express");
const mongoose=require("mongoose");
const ejs = require("ejs");

const lodash=require("lodash");

require("dotenv").config();

// Mongoose connection
const dbUrl="mongodb+srv://himat1607:"+process.env.mongodbpass+"@cluster0.6rfsg.mongodb.net/journalDB?retryWrites=true&w=majority";
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

// Post Schema
const postSchema= new mongoose.Schema({
  title: String,
  body: String,
  link: String
});

//Posts Collection
const Post=mongoose.model("Post",postSchema);


const homeStartingContent = "This Journal is used to post what I code while learning or for fun.\nThis Journal App is made using Express Node Framework and uses MongoDB for a database to post and fetch posts displayed here using mongoose ODM.";
const aboutContent = "Himatkumar Purohit\nSoftware Developer";
const contactContent = "Email: himatpurohit1607@gmail.com\nPh No: +91 99309 12606";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Post.find({},function(err,result){
    if(result.length>0){
      res.render("home",{homeStartingContent:homeStartingContent,posts:result});
    }else{
      res.render("home",{homeStartingContent:homeStartingContent,posts:[]});
    }
  })
})
.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
})
.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
})
.get("/post/:postId",function(req,res){
  // const searchTitle=lodash.lowerCase(req.params.postTitle);
  const searchID=req.params.postId;
  Post.findOne({_id: searchID},function(err,result){
    res.render("post",{postTitle:result.title,postBody:result.body,postLink:result.link});
  });
})
.get("/compose",function(req,res){
  res.render("compose");
})
.post("/compose",async function(req,res){
  const post=new Post({
    title:req.body.newPostTitle,
    body:req.body.newPostBody,
    link:req.body.newPostLink
  });
  await post.save();
  // posts.push(post);
  res.redirect("/");
})



let port= process.env.PORT;
if(port==null||port==""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started on port "+port);
});