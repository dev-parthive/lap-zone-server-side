const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000 ;
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
require('colors')
//middleware
app.use(cors());
app.use(express.json())


//endpont 
app.get('/' , async(req, res)=>{
    res.send('Lap-zone server is running')
})

// make connection with mongodb 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afdwhlk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect(){
    try{
        // akane cesta kora hocce database sateh connect korar 
        await client.connect()
        console.log('database connnected'.yellow.bold)
    }
    catch(err){
        console.log(err.name.bgRed , err.message.bold, err.stack)
    }
}
dbConnect();
// --------------------
const productCollection = client.db("Lap-Zone").collection("products")
const usersCollection = client.db("Lap-Zone").collection("users")
const ordersCollection = client.db("Lap-Zone").collection("orders")


// end point 

// register kora users er data database a store korar jonno 
app.post('/users', async(req, res)=>{
    const user = req.body
    // console.log(user)
    const result = await usersCollection.insertOne(user);
    res.send(result)
    
})

// to get specific category product 
app.get('/products/:name', async(req, res)=>{
    try{
        const name = req.params.name
        // console.log(name)
        const products = await productCollection.find({brand: name}).toArray()
        res.send({
            success: true, 
            data : products
        })
    }
    catch(err){
        res.send({
            success: false, 
            error: err.message
        })
    }
})

// client  k use kore ami database theke data nibo 
//takes order from buyer/cutomer 
app.post('/orders' , async(req,res)=>{
   try{
    const order = req.body;
    // console.log(order)
    const result = await ordersCollection.insertOne(order);
    res.send({
        success: true , 
        message: 'Order Booked ',
        data: result
    })
   }
   catch(err){
    res.send({
        success: false, 
        message: 'something went wrong '
    })
   }
        
})



app.listen(port, ()=> console.log('server is running '.blue))