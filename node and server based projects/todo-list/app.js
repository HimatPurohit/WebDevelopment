const express=require("express");
const date=require(__dirname+"/date.js");


const app=express();
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

var items=["Buy Food","Cook Food","Eat Food"];
var workItems=[];

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("list",{listTitle:date.day(), newListItems:items});
})
.get("/work",function(req,res){
    res.render("list",{listTitle:"Work", newListItems:workItems});
})
.post("/",function(req,res){
    var item=req.body.newItem;
    if(item!=""){
        if(req.body.addButton==="Work"){
            workItems.push(item);
            res.redirect("/work")
        }else{
            items.push(item);
            res.redirect("/");
        }
    }
})

app.listen(3000,function(){
    console.log("Server started at localhost:3000");
});