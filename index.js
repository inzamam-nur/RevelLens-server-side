const express = require("express");
const app = express();
const port = process.env.Port || 5000;
const cors = require("cors");
app.use(cors());

const services = require("./Data/service.json");

app.get("/", (req, res) => {
    res.send("Api Running");
  });
  
  app.get("/services", (req, res) => {
    res.send(services);
  });
  app.listen(port, () => {
    console.log("running", port);
  });