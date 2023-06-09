const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express=require("express")
const cors=require("cors")
const port=process.env.PORT || 5000;
const app=express();

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzxjncj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const collection= client.db("ema-john").collection("products");
      app.get("/products",async(req,res)=>{
        const page=parseInt(req.query.page) || 0;
        const limit=parseInt(req.query.limit) ||10;
        const skip=page*limit;
        const result=await collection.find().skip(skip).limit(limit).toArray();
        res.send(result);
    })

    app.get("/total",async(req,res)=>{
      const result=await collection.estimatedDocumentCount();
      res.send({result});
    })

    app.post("/orders",async(req,res)=>{
        const ids=req.body;
        const objectId=ids.map(id => new ObjectId(id));
        const query={_id: {$in:objectId}}
        const result=await collection.find(query).toArray();
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.get("/",(req,res)=>{
        res.send("ok")
})

app.listen(port,()=>{
    console.log(`RUNNING ON ${port}`)
})
