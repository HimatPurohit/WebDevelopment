const express=require("express");
// const bodyParser=require("body-parser");

var app=express();
app.use(express.urlencoded({extended: true}));

app.get("/",function(req,res){
// res.send("Hello World");
    res.sendFile(__dirname+"/index.html");
})
.post("/",function(req,res){
    var num1=Number(req.body.num1);
    var num2=Number(req.body.num2);
    var result=num1+num2;
    res.send("The Result of Addition is: "+result);
});

app.get("/bmicalculator",function(req,res){
    res.sendFile(__dirname+"/bmiCalculator.html");
})
.post("/bmicalculator",function(req,res){
    var height=parseFloat(req.body.height);
    var weight=parseFloat(req.body.weight);
    var result=height/(weight*weight);
    res.send("Your BMI is "+result);
});


app.listen(3000,function(){
    console.log("Server started, acess at localhost:3000");
})