const mongoose= require("mongoose");

mongoose.connect("mongodb://localhost:27017/productsDB",{useNewUrlParser:true,useUnifiedTopology:true});

// Create Schema i.e. the structure of the collection
const productSchema= new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});

// defines the collection name and its schema
const Product=mongoose.model("Products", productSchema)

// creates document to be used in query
const product=new Product({
  name: "Paper",
  rating: 4,
  review: "Pretty Good clarity and whiteness"
});

// Inserts the product into Products collection inside productsDB
// product.save();
// product.save().then(()=>{
//   console.log("product added")
//   closeConnection();
// });

//insertMany in collections
// Product.insertMany([
//   {name: "Pen",rating: 4,review: "Pretty smooth and long lasting"},
//   {name: "Stapler",rating: 5,review: "Sturdy and does its work"},
//   {name: "Pad",rating: 4,review: "Durable as well as flexible"}
// ],function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("products added");
//   }
// });


//findall data from Products collection
Product.find(function(err,result){
  if(err){
    console.log(err);
  }else{
    result.forEach((element)=>{
      console.log(element.name);
    });
    closeConnection();
  }
});

function closeConnection(){
  mongoose.connection.close();
}