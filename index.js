const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(express.json());

const port =process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xldcc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






client.connect((err) => {
    const productsCollection = client.db("oClock").collection("Products");
    const bookingsCollection = client.db("oClock").collection("bookings");
    const reviewCollection = client.db("oClock").collection("Reviews");
    const usersCollection = client.db("oClock").collection("users");
  
 

    //user
  app.post("/users", async (req, res) => {
    const user=req.body;
   const result=await usersCollection.insertOne(user);
   console.log(result);
   res.json(result);

    res.send(result);
    console.log(result);
  });
 
  // app.put("/users", async (req, res) => {
  //   const email=req.body;
  //   const filter={
  //     email:user.email
  //   };
  //   options={upsert:true};
  //   const updateDoc ={$set:user}
  //   const result=await usersCollection.updateOne(filter, updateDoc,options);
  //   console.log('put',user);
  //   res.send(result);
  //   console.log(result);
  // });
  //admin
app.put("/users/admin", async (req, res) => {
  const user=req.body;
  const filter={email:user.email};
  const updateDoc={$set:{role: 'admin'}}
  const result=await usersCollection.updateOne(filter, updateDoc);
  console.log('put',user);
  res.json(result);
  // res.send(result);
  console.log(result);
});
app.get("/users/:email", async (req, res) => {
  const email=req.params.email;
  const query={email:email}
  const user = await usersCollection.findOne(query);
  let isAdmin=false;
  if(user?.role==='admin'){
    isAdmin=true;
  }
  res.json({admin :isAdmin});
  
});
  
    // adding new services
  
    app.post("/addServices", async (req, res) => {
        const product=req.body;
        // console.log(service);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
  
   //all Services
    app.get("/allServices", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
      
    });
        //add review
  app.post("/review", async (req, res) => {
    const product=req.body;
    console.log(product);
  const result = await reviewCollection.insertOne(product);
  res.send(result);
});
  //show review 

  app.get("/review", async (req, res) => {
    const result = await reviewCollection 
    .find({}).toArray();
    res.send(result);
  });
  
    //each service load
    app.get("/singleProduct/:ServiceId", async (req, res) => {
      const result = await productsCollection
        .find({ _id: ObjectId(req.params.ServiceId) })
        .toArray();
      res.send(result[0]);
    });


  
    //order
    app.post("/confirmOrder", async (req, res) => {
      const result = await bookingsCollection.insertOne(req.body);
      res.send(result);
    });
  
    //get myOrder
  
    app.get("/myOrder/:email", async (req, res) => {
      const result = await bookingsCollection
        .find({ Email: req.params.email})
        .toArray();
      res.send(result);
      console.log(result);
    });
  
    //delete order
  
    app.delete("/deleteOrder/:id", async (req, res) => {
      const result = await bookingsCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
  
   // all order
    app.get("/allOrders", async (req, res) => {
      const result = await bookingsCollection.find({}).toArray();
      res.send(result);
    });
  
   // update statuses
  
    app.put("/updateStatus/:id", (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body.status;
      const filter = { _id: ObjectId(id) };
      console.log(updatedStatus);
      bookingsCollection
        .updateOne(filter, {
          $set: { status: updatedStatus },
        })
        .then((result) => {
          res.send(result);
        });
    });
  });

  

  
app.get('/',(req,res)=>{
  res.send('Running dream Travel');
})

app.listen(port,()=>{
  console.log("Running Server on port", port);
});