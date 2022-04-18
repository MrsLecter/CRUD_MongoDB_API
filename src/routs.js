const express = require("express");
const mongoBase = require("./dbservice");
const router = new express.Router();
const bodyParser = require("body-parser");

let jsonParser = bodyParser.json();

router.get("/", async (req, res) => {
  res.status(200).render("index.hbs", { title: "Home page", page: "Home" });
});

router.get("/persons", async (req, res) => {
  const dbConnect = mongoBase.getDb();
  dbConnect
    .collection("person")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error 400");
      } else {
        res.render("index.hbs", {
          title: "Persons page",
          page: "Persons",
          result,
        });
      }
    });
});

router.get("/persons/:name", async (req, res) => {
  const dbConnect = mongoBase.getDb();
  dbConnect
    .collection("person")
    .find({ name: req.params.name })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error 400");
      } else {
        res.render("index.hbs", {
          title: "Persons page",
          page: "Persons",
          result,
        });
      }
    });
});

router.post("/persons", jsonParser, (req, res) => {
  const dbConnect = mongoBase.getDb();
  const matchDocument = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    age: req.body.age,
    phone: req.body.phone,
    company: req.body.company,
    address: req.body.address,
    last_modified: new Date(),
  };
  dbConnect
    .collection("person")
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting matches!");
      } else {
        res.status(204).send();
      }
    });
});

router.put("/persons/:name", jsonParser, async (req, res) => {
  const dbConnect = mongoBase.getDb();
  const query = { name: req.body.name };
  const updates = {
    $set: {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        age: req.body.age,
        phone: req.body.phone,
        company: req.body.company,
        address: req.body.address,
        last_modified: new Date()
    }
  };
  dbConnect
    .collection("person")
    .updateOne(query, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating likes ${query.name}!`);
      } else {
        console.log("1 document updated");
      }
    });
});

router.delete("/persons/:name", jsonParser, async (req, res) => {
  const dbConnect = mongoBase.getDb();
  const query = { name: req.body.name };
  dbConnect.collection("person").deleteOne(query, function (err, _result) {
    if (err) {
      res.status(400).send(`Error deleting listing with id ${query.query_id}!`);
    } else {
      console.log("1 document deleted");
    }
  });
});

router.get("/adults", async (req, res) => {
  const age = 18;
  const dbConnect = mongoBase.getDb();

  const cursor = dbConnect
    .collection("person")
    .find({
      age: { $gte: age }, //gte - greather or equal
    })
    .sort({ age: -1 });
  const result = await cursor.toArray();
  res
    .status(200)
    .render("index.hbs", { title: "Adult page", page: "Adults", result });
});


module.exports = router;
