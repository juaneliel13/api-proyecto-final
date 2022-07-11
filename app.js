const express = require("express")
const notification = require("./notifications")

const db = require("./database")
const app = express()


const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:false,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
   methods: [
    'GET',
    'POST',
  ],
}


app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post("/action", function(req,res){
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
  res.send(await db.getAll())
  
})


app.get('/level/:id', async function(req,res){
  res.send(await db.getLevel(req.params.id))
})

app.post('/level/:id', async function(req,res){
  await db.setRemember(req.params.id,req.body)
  res.send("level "+req.params+" updated")
})


app.get('/level/remember/:id', async function(req,res){
  res.send(await db.getRemember(req.params.id))
})

app.post('/result', cors(corsOptions),async function(req,res){
  res.send(await db.createResult(req.body))
})


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});