const express = require("express");
const app = express();
const port = process.env.Port || 5000;
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nnocokg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  const serviceCollection = client.db("Revelelens_db").collection("services");
async function run(){
    try{
        app.get("/services",async (req, res) => {
            const query = {}
            const cursor=serviceCollection.find(query);
            const services=await cursor.toArray();
            res.send(services);
          });
    }
    finally{

    }
}
run().catch(err => console.error(err));


app.get("/", (req, res) => {
    res.send("Api Running");
  });
  
  
 
  app.listen(port, () => {
    console.log("running", port);
  });