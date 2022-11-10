const express = require("express");
const app = express();
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
async function run() {
  try {
    const serviceCollection = client.db("Revelelens_db").collection("services");
    const reviewCOllection = client.db("Revelelens_db").collection("review");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort( { _id: -1 });
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

    app.get("/reviews", async (req, res) => {
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

    app.get("/review", async (req, res) => {
      let query = {};

      if (req.query.service) {
        query = {
          service: req.query.service,
        };
      }

      const cursor = reviewCOllection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
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
