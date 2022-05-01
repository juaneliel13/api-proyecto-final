const express = require("express")
const notification = require("./notifications")

const db = require("./database")
const app = express()

const bodyParser = require('body-parser');
const { database } = require("firebase-admin")
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.post("/topic", function(req,res){
    res.send("Sending notification to a topic...")
    const data = {
        topic: req.body.topic,
        titulo: req.body.title,
        mensaje:req.body.body,
        data:req.body.data

    }
    notification.sendPushToTopic(data)
})

app.get('/getConfig', async function(req,res){
  res.send(await db.getAll())
  
})


app.get('/getLevel/:id', async function(req,res){
  res.send(await db.getLevel(req.params.id))
})


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});