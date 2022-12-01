const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000 ;
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()
require('colors')

//middleware
app.use(cors());
app.use(express.json())

// verify jwt middleware 
function verifyJWT(req, res ,  next ){
    console.log('token' , req.headers.authorization)
    const authHeader = req.headers.authorization; 
    if(!authHeader){
        return res.status(401).send('Forbiden access')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded)=>{
        if(err){
            return res.send({message: 'forbidded access'})
        }
        req.decoded = decoded; 

        next()
    })
}

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
 try{
    const user = req.body
    // console.log(user)
    const result = await usersCollection.insertOne(user);
    res.send(result)
 }
 catch(err){
    console.loog(err.message)
    res.send(err.message)
 }
    
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

// jsonwebtoken generator api 
app.get('/jwt' , async(req, res)=>{
    const email = req.query.email;
    const query = {email: email}
    const user = await usersCollection.findOne(query)
    console.log(user)
     
    if(user){
        const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '10h'})
        return res.send({
            accessToken  : token
        })
    }
    res.status(403).send({accessToken: ''})
})

// speciifc user orders load api 
app.get('/orders', verifyJWT , async(req, res)=>{
  try{
    const email = req.query.email
    // console.log(email)
    // console.log('token' , req.headers.authorization)
    const decodeEmail = req.decoded.email;
    console.log(decodeEmail)
    if(email != decodeEmail){
        return res.send({
            success: false,
            message: 'Forbidden access of not having access token '
        })
    }
    const query  = {userEamil: email}
    const orders = await ordersCollection.find(query).toArray()
    res.send(orders)
  }
  catch(err){
    console.log(err.message)
    res.send({
        success: false, 
        message: "Data couldn't loaded from DB"
    })
  }
})


// all sellers laod api 
app.get('/allsellers', async(req, res)=>{
    try{
        const query = {role: 'seller'}
        const sellers = await usersCollection.find(query).toArray()
        res.send(sellers)
    }
    catch(err){
        console.log(err.message)
        res.send(err.message)
    }
})
// all buyers load api 
app.get('/allbuyer', async(req, res)=>{
    try{
        const query = {role: 'buyer'}
        const buyers = await usersCollection.find(query).toArray()
        res.send(buyers)
    }
    catch(err){
        console.log(err.message)
        res.send(err.message)
    }
})

// delete specific buyer using email 
app.delete('/seller/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const query = ({_id: ObjectId(id)})
        const result = await usersCollection.deleteOne(query)
        if(result.deletedCount){
            res.send({
                success: true, 
                message: 'Seller deleted successfully'

            })
        }
        else{
            res.send({
                success: false, 
                message: "something went wrong "

            })
        }
    }
    catch(err){
        res.send({
            success: false, 
            message: err.message
        })
    }
})

app.listen(port, ()=> console.log('server is running '.blue))