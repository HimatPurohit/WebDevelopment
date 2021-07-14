const express=require("express");
const mongoose=require("mongoose");
const lodash=require("lodash");
// const date=require(__dirname+"/date.js");

require("dotenv").config();

let port = process.env.PORT;

const app=express();
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");

//Mongoose Connection to local MongoDB
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

// Mongoose connection to MongoDB Atlas(cloud)
mongoose.connect("mongodb+srv://himat1607:"+process.env.mongodbpass+"@cluster0.6rfsg.mongodb.net/todolistDB?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});


const taskSchema=new mongoose.Schema({name:String});

const Task=mongoose.model("tasks",taskSchema);

// Default items to be added for the first time
const task1=new Task({
    name:"Buy Food."
});
const task2=new Task({
    name:"Hit + button to add new task."
});
const task3=new Task({
    name:"<-----select this box to delete the task."
});

const defaultTasks=[task1,task2,task3];

//Schema for custom User Tasks
const customTaskSchema=new mongoose.Schema({
    name: String,
    items: [taskSchema]
});

const customTask=mongoose.model("customtasks",customTaskSchema);


app.get("/",function(req,res){
    //fetching the data from database
    Task.find({},async function(err,result){
        if(result.length===0){
            await Task.insertMany(defaultTasks,function(err){
                if(err){console.log(err)}
            });
            res.redirect("/");
        }else{
            res.render("list",{listTitle:"Today", newListItems:result}); 
        }
    });
})
.get("/:userList",function(req,res){
    const customTaskName= lodash.capitalize(req.params.userList);
    console.log(req.params);
    
    customTask.findOne({name:customTaskName},async function(err,result){
        if(!err){
        if(!result){
                const task=new customTask({
                    name:customTaskName,
                    items: defaultTasks
                });
                await task.save();
                res.redirect("/"+customTaskName);
        }else{
            res.render("list",{listTitle:customTaskName, newListItems:result.items}); 
        }
    }

});
})
.post("/",async function(req,res){
    var newItem=req.body.newItem;
    var listname=req.body.listName;
    // if(item!=""){
    //     if(req.body.addButton==="Work"){
    //         workItems.push(item);
    //         res.redirect("/work")
    //     }else{
    //         items.push(item);
    //         res.redirect("/");
    //     }
    // }

    // Uploading latest Added Item in Database
    if(newItem!=""){
        const task=new Task({
            name:newItem
        });
        // Checks the list to be used
        if(listname==="Today"){
            await task.save();
            res.redirect("/");
        }else{
            customTask.findOne({name:listname},async function(err,result){
                if(!err){
                    result.items.push(task);
                    await result.save();
                    res.redirect("/"+listname);
                }
        });
        }
    }
})
.post("/delete",function(req,res){
    // Deleting checked Item from Database
    const id=req.body.checkbox;
    var listname=req.body.listName;
    // Item.deleteOne({_id:id},function(err){
        // if(err){
        //     console.log(err);
        // }else{
        //     res.redirect("/");
        // }
    // });
    // Checks the list to be used
    if(listname==="Today"){
        Task.findByIdAndRemove(id,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            };
        });
    }else{
        customTask.findOneAndUpdate({name:listname},
            {$pull:{items: {_id:id}}},function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/"+listname);
            };
        });
    }
    
})



if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

// app.listen(port,function(){
//     console.log("Server started at localhost:3000");
// });