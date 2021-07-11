const express=require("express");
const mongoose=require("mongoose");
const lodash=require("lodash");
// const date=require(__dirname+"/date.js");


const app=express();
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");

//Mongoose Connection to MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

const itemsSchema=new mongoose.Schema({name:String});

const Item=mongoose.model("Item",itemsSchema);

// Default items to be added for the first time
const item1=new Item({
    name:"Buy Food."
});
const item2=new Item({
    name:"Hit + button to add new task."
});
const item3=new Item({
    name:"<-----select this box to delete the task."
});

const defaultItems=[item1,item2,item3];

//Schema for UserList
const userListSchema=new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const UserListItem=mongoose.model("userList",userListSchema);


app.get("/",function(req,res){
    //fetching the data from database
    Item.find({},function(err,result){
        if(result.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){console.log(err)}
            });
            res.redirect("/");
        }else{
            res.render("list",{listTitle:"Today", newListItems:result}); 
        }
    });
})
.get("/:userList",function(req,res){
    const userListName= lodash.capitalize(req.params.userList);
    
    UserListItem.findOne({name:userListName},function(err,result){
        if(!err){
        if(!result){
                const list=new UserListItem({
                    name:userListName,
                    items: defaultItems
                });
                list.save();
            res.redirect("/"+userListName);
        }else{
            res.render("list",{listTitle:userListName, newListItems:result.items}); 
        }
    }

});
})
.post("/",function(req,res){
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
        const item=new Item({
            name:newItem
        });
        // Checks the list to be used
        if(listname==="Today"){
            item.save();
            res.redirect("/");
        }else{
            UserListItem.findOne({name:listname},function(err,result){
            result.items.push(item);
            result.save();
            res.redirect("/"+listname);
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
        Item.findByIdAndRemove(id,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            };
        });
    }else{
        UserListItem.findOneAndUpdate({name:listname},
            {$pull:{items: {_id:id}}},function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/"+listname);
            };
        });
    }
    
})

app.listen(3000,function(){
    console.log("Server started at localhost:3000");
});