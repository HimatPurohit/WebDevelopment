const express = require("express");
const mongoose=require("mongoose");
const ejs = require("ejs");

const lodash=require("lodash");

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


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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