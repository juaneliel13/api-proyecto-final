const express = require("express")
const notification = require("./notifications")

const db = require("./database")
const app = express()


const bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



app.post('/result',async function(req,res){
  res.send(await db.createResult(req.body))
})



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

app.put('/result/:id', async function(req,res) {
  res.send(await db.updateResult(req.params.id,req.body))
})

app.get('/result', async function(req,res) {
  console.log(req.query.name);
  res.send(await db.searchResults(req.query.name))
})


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});