const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ee8t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5001

app.get('/', (req, res) => {
  res.send("hello")
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("cruiseShip").collection("services");

  app.get('/services', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
  app.post('/addService', (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  app.delete('/deleteService/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete product', id);
    serviceCollection.findOneAndDelete({ _id: id })
      .then(documents => res.send(!!documents.value))
  })
});

app.listen(process.env.PORT || port)