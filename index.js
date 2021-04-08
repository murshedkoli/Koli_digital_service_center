const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmtd1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(cors());



client.connect(err => {
  const productsCollection = client.db("myshop").collection("products");
  const ordersCollection = client.db("myshop").collection("orders");

  app.post("/addproduct", (req, res)=>{
      const product = req.body;
      productsCollection.insertOne(product)
      .then(result =>{
          console.log(result.insertedCount)
          res.send(result)
      })
  })


  app.post("/cartproduct", (req, res)=>{
    const productsid = req.body;
    console.log(productsid)
    productsCollection.find({uid: {$in: productsid}})
    .toArray((err, documents) =>{
        res.send(documents);
       
    })
})


  app.get("/products", (req, res)=>{
      productsCollection.find({})
      .toArray((err, documents)=>{
          res.send(documents)
      })
  })

  app.get("/orders", (req, res)=>{
      const email= req.query.email;
      
    ordersCollection.find({email : email})
    .toArray((err, documents)=>{
        res.send(documents)
    })
})



app.delete("/delete/:id",(req, res)=>{
    const id= req.params.id;
    productsCollection.deleteOne({_id : ObjectId(id)})
    .then(result=>{
        console.log(result)
    });
})


app.get("/product:id", (req, res)=>{
    const id= req.params.id;
    console.log(id)
    productsCollection.find({_id : ObjectId(id)})
    .toArray((err, document)=>{
        res.send(document[0])
    })
});


app.post("/placeorder", (req, res)=>{
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result=> res.send(result))
})



  console.log("Database Connected")
});


app.listen(4000)