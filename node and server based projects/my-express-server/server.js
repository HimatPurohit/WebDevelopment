const express=require("express");

const app= express();

app.listen(3000,function() {
    console.log("Server started on port 3000\nAccess it using localhost:3000")
});

app.get("/",function(request,response) {
    response.send("<strong>Hello!!</strong>");
});
app.get("/hi",function(request,response) {
    response.send("<strong>Bye!!</strong>");
});