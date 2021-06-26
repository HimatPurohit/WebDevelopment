const { response } = require("express");
const express=require("express");
const https=require("https");

const app=express();

app.use(express.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
.post("/",function(req,res){
    const query=req.body.cityName;
    const apiKey="59f57b3c5735506cabcf0a7f32990285";
    const unit="metric";
    const weatherUrl="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
    https.get(weatherUrl,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherdata=JSON.parse(data);
            // console.log(weatherdata);
            const temp=weatherdata.main.temp;
            const description=weatherdata.weather[0].description;
            
            res.send("<h1>The temperature is "+ temp+"<sup>o</sup> and its "+ description +"</h1>")
        })
    });
})


app.listen(3000,function(){
    console.log("Server started at localhost:3000");
})