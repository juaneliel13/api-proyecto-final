
var admin = require("firebase-admin");

function initFirebase(){
    var serviceAccount = require("./keys/serviceAccountKey.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://proyectofinalingenieriaviviant-default-rtdb.firebaseio.com"
    });
}

initFirebase()

function sendPushToTopic(notification){
    const message = {
        topic: notification.topic,
        data:notification.data,
        notification:{
            title:notification.titulo,
            body:notification.mensaje
        }
    }
    sendMessage(message)
}

module.exports = { sendPushToTopic}

function sendMessage(message){
    admin.messaging().send(message)
    .then((response) =>{
        console.log("Successfully sent message: ",response)
    })
    .catch((error) =>{
        console.log("Error sending message: ",error);
    })
}