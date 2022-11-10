const express = require("express");
const app = express();
const jwt=require('jsonwebtoken')
const port = process.env.Port || 5000;
const cors = require("cors");
require("dotenv").config();
const { mongoose, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nnocokg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;

  if(!authHeader){
      return res.status(401).send({message: 'unauthorized access'});
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
      if(err){
          return res.status(403).send({message: 'Forbidden access'});
      }
      req.decoded = decoded;
      next();
  })
}


async function run() {
  try {
    const serviceCollection = client.db("Revelelens_db").collection("services");
    const reviewCOllection = client.db("Revelelens_db").collection("review");


    app.post("/jwt", (req, res) => {
        const user = req.body;
        // console.log(user);
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "7d",
        })
  
        res.send({ token })
      });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({ _id: -1 });
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.get("/serviceslimit", async (req, res) => {
      const size = 3;
      const query = {};
      const cursor = serviceCollection.find(query).limit(size).sort( { _id: -1 });
      const services = await cursor.toArray();
      res.send(services);
    });
    app.post("/service", async (req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.send(result);
      });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCOllection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews",verifyJWT, async (req, res) => {
    
      const decoded = req.decoded;
      if (decoded.email !== req.query.email) {
        res.status(403).send("Forbidden Email ");
      }

      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = reviewCOllection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCOllection.deleteOne(query);
      res.send(result);
    });

  app.get('/reviews/:id',async(req,res)=>{
    const service=req.params.id;
    const query ={service:service};
    const cursor=reviewCOllection.find(query).sort({datefield: -1});
    const reviews=await cursor.toArray();
    res.send(reviews)
  })

  app.get('/review/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: ObjectId(id)}
    const cursor=await reviewCOllection.findOne(query);
    res.send(cursor)
  })

  app.put("/review/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const reviews = req.body;

    // console.log(reviews);

    const option = { upsert: true };
    const updatedReview = {
      $set: {
        message: reviews.message,
       
      },
    };

    const result = await reviewCOllection.updateOne(
      filter,
      updatedReview,
      option
    );

    res.send(result);
  });

  
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Api Running");
});

app.listen(port, () => {
  console.log("running api", port);
});
