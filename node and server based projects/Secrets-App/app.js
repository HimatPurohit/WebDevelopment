const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
// const encrypt=require("mongoose-encryption");
// const md5=require("md5");
// const bcrypt=require("bcrypt");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");


require("dotenv").config();

const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.set('useCreateIndex',true);

// Defines sessions
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

// initializes passport and session
app.use(passport.initialize());
app.use(passport.session());

//Mongoose Connection\
const dbUrl="mongodb+srv://himat1607:"+process.env.mongodbpass+"@cluster0.6rfsg.mongodb.net/"+process.env.mongodb+"?retryWrites=true&w=majority";
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

const userSchema=new mongoose.Schema({
    email:String,
    pass:String,
    secret: String
});

//adds passport local mongoose plugin into Schema
userSchema.plugin(passportLocalMongoose)

// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["pass"]});

const User=new mongoose.model("User",userSchema);

//uses passport to store user information
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes
app.route("/")
.get(function(req,res){
    if(req.isAuthenticated()){
        res.redirect("/secrets");
    }else{
        res.render("home");
    }
});

app.route("/login")
.get(function(req,res){
    if(req.isAuthenticated()){
        res.redirect("/secrets");
    }else{
        res.render("login");
    }
})
.post(function(req,res){
    // const email= req.body.username;
    // const pass= req.body.password;

    // User.findOne({email:email},function(err,result){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(result){
    //             bcrypt.compare(pass,result.pass,function(err,userExists){
    //                 if(userExists===true){
    //                     res.render("secrets");
    //                 }
    //             });
    //         }
    //     }
    // });

    const user = new User({
        username: req.body.username,
        pass: req.body.password
    });

    req.login(user, function(err){
        if(err) {
            console.log(err);
        }else{
            passport.authenticate("local",{failureRedirect:"/login"})(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.route("/register")
.get(function(req,res){
    res.render("register");
})
.post(function(req,res){
    const email= req.body.username;
    // const pass= md5(req.body.password);
    const pass= req.body.password;
    // bcrypt.hash(pass,parseInt(process.env.saltrounds),function(err,hash){
    //     User.findOne({email:email},function(err,result){
    //         if(err){
    //             console.log(err);
    //         }else if(result===[] || result==null){
    //             const newUser=new User({
    //                 email:email,
    //                 pass:hash
    //             });
    //             newUser.save(function(err){
    //                 if(!err){
    //                     res.render("secrets");
    //                 }else{
    //                     console.log(err);
    //                 }
    //             });
    //         }else{
    //             res.redirect("/login");
    //         }
    //     });
    // });

    User.register({username: email},pass,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });
});


app.route("/submit")
.get(function(req, res){
    if (req.isAuthenticated()){
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  })
.post(function(req, res){
    const submittedSecret = req.body.secret;
  
    User.findById(req.user.id, function(err, foundUser){
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.secret = submittedSecret;
          foundUser.save(function(){
            res.redirect("/secrets");
          });
        }
      }
    });
  });


app.route("/secrets")
.get(function(req,res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUsers){
            if (err){
              console.log(err);
            } else {
              if (foundUsers) {
                res.render("secrets", {usersWithSecrets: foundUsers});
              }
            }
          });
    }else{
        res.redirect("login");
    }
})
.post(function(req,res){
});

app.route("/logout")
.get(function(req,res){
    req.logout();
    res.redirect("/");
});


let PORT=process.env.PORT;
if(PORT==""||PORT==null){
    PORT=3000;
}

app.listen(PORT);