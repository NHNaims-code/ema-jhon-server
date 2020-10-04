const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const port = 5000

const app = express()
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjmet.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
    console.log('database contected');

    app.post('/addproduct',(req, res) => {
        const product = req.body;
        console.log(product);
        productsCollection.insertOne(product)
        .then(result => {
            console.log(result);
        })
    })
    
    app.get('/products', (req, res) => {
        productsCollection.find({}).limit(20)
        .toArray((err, documents) => {
            res.send(documents)
        }) 
    })
    
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        console.log("productsKeys");
        productsCollection.find({key: {$in: productsKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.post('/addorder',(req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
});



console.log(process.env.DB_USER);
app.listen(port)