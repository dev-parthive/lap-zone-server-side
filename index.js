const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000 ;
const app = express()


require('colors')
//middleware
app.use(cors());
app.use(express.json())


//endpont 
app.get('/' , async(req, res)=>{
    res.send('Lap-zone server is running')
})

app.listen(port, ()=> console.log('server is running '.blue))