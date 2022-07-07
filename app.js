const express = require("express")
const notification = require("./notifications")

const db = require("./database")
const app = express()

const bodyParser = require('body-parser');
const { database } = require("firebase-admin")
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.post("/action", function(req,res){
    res.header('Access-Control-Allow-Origin', '*');
    res.send("Sending notification to a topic...")
    const data = {
        topic: req.body.topic,
        titulo: req.body.title,
        mensaje:req.body.body,
        data:req.body.data

    }
    notification.sendPushToTopic(data)
})

app.get('/level', async function(req,res){
  res.header('Access-Control-Allow-Origin', '*');
  res.send(await db.getAll())
  
})


app.get('/level/:id', async function(req,res){
  res.header('Access-Control-Allow-Origin', '*');
  res.send(await db.getLevel(req.params.id))
})

app.post('/level/:id', async function(req,res){
  res.header('Access-Control-Allow-Origin', '*');
  await db.setRemember(req.params.id,req.body)
  res.send("level "+req.params+" updated")
})


app.get('/level/remember/:id', async function(req,res){
  res.header('Access-Control-Allow-Origin', '*');
  res.send(await db.getRemember(req.params.id))
})

app.post('/result', async function(req,res){
  res.header('Access-Control-Allow-Origin', '*');
  res.send(await db.createResult(req.body))
})


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});