const express = require("express")
const notification = require("./notifications")

const db = require("./database")
const app = express()


const cors=require("cors");
/*const corsOptions ={
   origin:'*', 
   credentials:false,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


app.use(cors()) // Use this after the variable declaration
*/

const whitelist = ["https://app-viviant.herokuapp.com","https://localhost:3000"]
const corsOptions = {
 origin: function (origin, callback) {
    if(!origin){//for bypassing postman req with  no origin
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

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