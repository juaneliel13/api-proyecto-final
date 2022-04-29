const express = require("express")
const notification = require("./notifications")

const app = express()

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


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});