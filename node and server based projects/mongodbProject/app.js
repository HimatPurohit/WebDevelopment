const MongoClient= require("mongodb").MongoClient;
const assert=require("assert")

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dbName="himatDB";
const collectionName="products";
const query = { name: 'pencil' };

async function run() {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    //Search Query
    const result = await collection.findOne(query);
    console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);