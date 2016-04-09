"use strict";

const express = require("express");
const app = express();
const mongoClient = require("mongodb").MongoClient;
const routes = require("./routes");

require("dotenv").config({
  silent: true
});

app.set("port", process.env.PORT);
app.set("mongo_uri", process.env.MONGOLAB_URI);

mongoClient.connect(app.get("mongo_uri"), function(err, db) {
  if (err) {
    throw err;
  }
  console.log(`MongoDB is running on ${app.get("mongo_uri")}`);

  db.dropCollection('urls', function(err, result) {
    if (err) {
      throw err;
    }
    db.createCollection('urls');
  })


  routes(app, db);

  app.listen(app.get("port"), function() {
      console.log(`The app is running on port ${app.get("port")}`);
  });
});
