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
// client  k use kore ami database theke data nibo 

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


app.listen(port, ()=> console.log('server is running '.blue))