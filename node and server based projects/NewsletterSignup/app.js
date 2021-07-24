const express=require("express");
const https=require("https");

const app=express();

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})
.post("/",function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data)

    const url="https://us6.api.mailchimp.com/3.0/lists/6e0d51a6b9";

    const options={
        method: "POST",
        auth: "himat:"+process.env.apikey
    };

    const request = https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

    // b433495b9bf3825acd6455e8201809fc-us6
    // 6e0d51a6b9
});


// process.env.PORT is used for dynamic ports like heroku server
app.listen(process.env.PORT ||3000,function(){
    console.log("Server Started at localhost:3000");
});